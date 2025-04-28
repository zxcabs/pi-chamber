import { Gpio } from 'onoff'
import type { TGPIODeviceConfig } from '../../../config-reader/readConfig.types.ts'
import type { IGPIODevice, IGPIODeviceResult, TGPIOValue } from './types/IGPIODevice.type.ts'
import { EDeviceTypes } from './types/IBaseDeviceResult.types.ts'
import safeAsync from '../../../utils/safeAsync.ts'

export class GPIODevice implements IGPIODevice {
    readonly name: string
    private pin: number
    private gpio: Gpio | undefined
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
        const readResult = await safeAsync(this.gpio?.read())
        const value = readResult.success ? readResult.data : 0
        const error = readResult.success ? null : readResult.error

        return {
            type: EDeviceTypes.GPIO,
            name: this.name,
            time: Date.now(),
            value,
            error: error?.toString(),
        }
    }

    async write(writeValue: TGPIOValue): Promise<IGPIODeviceResult> {
        const readResult = await safeAsync(this.gpio?.write(writeValue))
        const value = readResult.success ? writeValue : 0
        const error = readResult.success ? null : readResult.error

        return {
            type: EDeviceTypes.GPIO,
            name: this.name,
            time: Date.now(),
            value,
            error: error?.toString(),
        }
    }

    async release(): Promise<void> {
        await this.gpio?.write(0)
        this.gpio?.unexport()
    }
}
