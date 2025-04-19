import { Gpio, type BinaryValue } from 'onoff'
import type { TLightConfig } from '../../../utils/readConfig.ts'
import type { ILight, ILightResult } from './ILight.type.ts'
import { EDeviceTypes } from './IBaseDeviceResult.types.ts'

export class Light implements ILight {
    readonly name: string
    private gpio: number
    private led: Gpio

    constructor(config: TLightConfig) {
        this.name = config.name
        this.gpio = config.gpio
    }

    async connect(): Promise<void> {
        this.led = new Gpio(this.gpio, 'out')
    }

    async read(): Promise<ILightResult> {
        let value: BinaryValue
        let error: Error

        value = await this.led.read().catch(e => (error = e))

        return {
            type: EDeviceTypes.Light,
            name: this.name,
            value,
            error: error?.toString(),
        }
    }

    async write(value: BinaryValue): Promise<ILightResult> {
        let error: Error

        await this.led.write(value).catch(e => (error = e))

        return {
            type: EDeviceTypes.Light,
            name: this.name,
            value,
            error: error?.toString(),
        }
    }

    async release(): Promise<void> {
        await this.led.write(0)
        this.led.unexport()
    }
}
