import { Gpio, type BinaryValue } from 'onoff'
import type { TPWMDeviceConfig } from '../../../config-reader/readConfig.types.ts'
import { EDeviceTypes } from './types/IBaseDeviceResult.types.ts'
import type { IPWMDevice, IPWMDeviceResult, TPWMValue } from './types/IPWMDevice.type.ts'

export class PWMDevice implements IPWMDevice {
    readonly name: string
    private pin: number
    private gpio: Gpio
    private pwmFrequency: number = 1
    private pwmResolution: number = 100
    private initialValue: TPWMValue = 0
    private currentValue: TPWMValue = 0
    private latesError: Error
    private isRunning: boolean = false

    private pwmTimerId: NodeJS.Timeout
    private pwmImmediateId: NodeJS.Immediate

    constructor(config: TPWMDeviceConfig) {
        this.name = config.name
        this.pin = config.gpio
        this.initialValue = this.parsePWMValue(config.initial_value)
        this.setPWMFrequency(config.frequency)
    }

    async connect(): Promise<void> {
        this.gpio = new Gpio(this.pin, 'out')
        this.setPWM(this.initialValue)
        this.execute()
    }

    async read(): Promise<IPWMDeviceResult> {
        return {
            type: EDeviceTypes.PWM,
            name: this.name,
            time: Date.now(),
            value: this.currentValue,
            error: this.latesError?.toString(),
        }
    }

    async write(value: TPWMValue): Promise<IPWMDeviceResult> {
        this.setPWM(value)
        await this.stopExecute()
        this.execute()

        return {
            type: EDeviceTypes.PWM,
            name: this.name,
            time: Date.now(),
            value: this.currentValue,
            error: this.latesError?.toString(),
        }
    }

    private parsePWMValue(value: TPWMValue): TPWMValue {
        return Math.max(0, Math.min(this.pwmResolution, value))
    }

    private setPWM(value: TPWMValue) {
        this.currentValue = this.parsePWMValue(value)
    }

    private setPWMFrequency(value: number) {
        this.pwmFrequency = Math.max(0, Math.min(100, value))
    }

    private async execute(): Promise<void> {
        const executeTime = 1000 / this.pwmFrequency
        const dutyCycle = this.currentValue / this.pwmResolution
        const onTime = dutyCycle * executeTime
        const offTime = executeTime - onTime

        this.isRunning = true

        if (onTime > 0) {
            const startTimeWriteOn = Date.now()
            await this.gpioWrite(1)
            const startTimeWriteOnDt = Date.now() - startTimeWriteOn

            this.setSavedTimeout(async () => {
                const startTimeWriteOff = Date.now()
                await this.gpioWrite(0)
                const startTimeWriteOffDt = Date.now() - startTimeWriteOff

                this.setSavedTimeout(() => this.execute(), offTime - startTimeWriteOffDt)
            }, onTime - startTimeWriteOnDt)
        } else {
            this.pwmTimerId = setTimeout(() => this.execute(), offTime)
        }
    }

    private setSavedTimeout(cb: () => void, time: number) {
        if (!this.isRunning) return

        if (time <= 0) {
            this.pwmImmediateId = setImmediate(cb)
        } else {
            this.pwmTimerId = setTimeout(cb, time)
        }
    }

    private async stopExecute(): Promise<void> {
        this.isRunning = false
        clearImmediate(this.pwmImmediateId)
        clearTimeout(this.pwmTimerId)
        await this.gpio.write(0)
    }

    private async gpioWrite(value: BinaryValue): Promise<void> {
        this.gpio.write(value).catch(e => (this.latesError = e))
    }

    async release(): Promise<void> {
        await this.stopExecute()
        this.gpio.unexport()
    }
}
