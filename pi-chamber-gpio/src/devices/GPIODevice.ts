import { Gpio, type BinaryValue } from 'onoff'
import type { TGPIODeviceConfig } from '../../../utils/readConfig.ts'
import type { IGPIODevice, IGPIODeviceResult } from './IGPIODevice.type.ts'
import { EDeviceTypes } from './IBaseDeviceResult.types.ts'

export class GPIODevice implements IGPIODevice {
    readonly name: string
    private gpio: number
    private led: Gpio
    private initial_value: BinaryValue = 0

    constructor(config: TGPIODeviceConfig) {
        this.name = config.name
        this.gpio = config.gpio
        this.initial_value = config.initial_value as BinaryValue
    }

    async connect(): Promise<void> {
        this.led = new Gpio(this.gpio, 'out')
        await this.led.write(this.initial_value)
    }

    async read(): Promise<IGPIODeviceResult> {
        let value: BinaryValue
        let error: Error

        value = await this.led.read().catch(e => (error = e))

        return {
            type: EDeviceTypes.Gpio,
            name: this.name,
            time: Date.now(),
            value,
            error: error?.toString(),
        }
    }

    async write(value: BinaryValue): Promise<IGPIODeviceResult> {
        let error: Error

        await this.led.write(value).catch(e => (error = e))

        return {
            type: EDeviceTypes.Gpio,
            name: this.name,
            time: Date.now(),
            value,
            error: error?.toString(),
        }
    }

    async release(): Promise<void> {
        await this.led.write(0)
        this.led.unexport()
    }
}
