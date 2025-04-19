import type { BinaryValue } from 'onoff'
import type { TLightsConfig } from '../../utils/readConfig.ts'
import type { ILight, ILightResult } from './devices/ILight.type.ts'
import { Light } from './devices/Light.ts'

export class Lights {
    private lights: Array<ILight>

    constructor(config: TLightsConfig) {
        this.lights = config.map(config => new Light(config))
    }

    async connect(): Promise<void> {
        await Promise.all(this.lights?.map(light => light.connect()))
    }

    async read(name: string): Promise<ILightResult> {
        const light = this.lights.find(light => light.name === name)

        if (!light) {
            throw new Error(`Light ${name} not found`)
        }

        return await light.read()
    }

    async write(name: string, value: BinaryValue): Promise<ILightResult> {
        const light = this.lights.find(light => light.name === name)

        if (!light) {
            throw new Error(`Light ${name} not found`)
        }

        return await light.write(value)
    }

    async readAll(): Promise<Array<ILightResult>> {
        return await Promise.all(this.lights.map(light => light.read()))
    }

    async writeAll(value: BinaryValue): Promise<Array<ILightResult>> {
        return await Promise.all(this.lights.map(light => light.write(value)))
    }

    async release(): Promise<void> {
        await Promise.all(this.lights.map(light => light.release()))
    }
}
