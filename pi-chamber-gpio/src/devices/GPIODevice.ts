import { Gpio, type BinaryValue } from 'onoff'
import type { TGPIODeviceConfig } from '../../../utils/readConfig.ts'
import type { IGPIODevice, IGPIODeviceResult, TGPIOValue } from './types/IGPIODevice.type.ts'
import { EDeviceTypes } from './types/IBaseDeviceResult.types.ts'

export class GPIODevice implements IGPIODevice {
    readonly name: string
    private pin: number
    private gpio: Gpio
    private initialValue: TGPIOValue = 0

    constructor(config: TGPIODeviceConfig) {
        this.name = config.name
        this.pin = config.gpio
        this.initialValue = this.toValue(config.initial_value)
    }

    private toValue(value: number): TGPIOValue {
        return Math.max(0, Math.min(1, value)) as TGPIOValue
    }

    async connect(): Promise<void> {
        this.gpio = new Gpio(this.pin, 'out')
        await this.gpio.write(this.initialValue)
    }

    async read(): Promise<IGPIODeviceResult> {
        let value: TGPIOValue
        let error: Error

        value = await this.gpio.read().catch(e => (error = e))

        return {
            type: EDeviceTypes.GPIO,
            name: this.name,
            time: Date.now(),
            value,
            error: error?.toString(),
        }
    }

    async write(value: TGPIOValue): Promise<IGPIODeviceResult> {
        let error: Error

        await this.gpio.write(value).catch(e => (error = e))

        return {
            type: EDeviceTypes.GPIO,
            name: this.name,
            time: Date.now(),
            value,
            error: error?.toString(),
        }
    }

    async release(): Promise<void> {
        await this.gpio.write(0)
        this.gpio.unexport()
    }
}
