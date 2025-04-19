import type { ITemperatureSensor, ITemperatureSensorReadResult } from './ITemperatureSensor.type.ts'
import type { TTemeperatureSensorConfig } from '../../../utils/readConfig.ts'
import MAX31865 from 'max31865'
import { EDeviceTypes } from './IBaseDeviceResult.types.ts'

class TemperatureSensorMAX31865 implements ITemperatureSensor {
    readonly name: string
    private bus: number
    private device: number
    private wires: number = 3
    private rtdNominal: number = 100
    private refResistor: number = 430
    private sensor: MAX31865

    constructor(config: TTemeperatureSensorConfig) {
        this.name = config.name
        this.bus = Number(config.options.bus) ?? 0
        this.device = Number(config.options.device) ?? 0
        this.wires = Number(config.options.wires) ?? 3
        this.rtdNominal = Number(config.options.rtdNominal) ?? 100
        this.refResistor = Number(config.options.refResistor) ?? 430
    }

    async connect(): Promise<void> {
        this.sensor = new MAX31865(this.bus, this.device, {
            wires: this.wires,
            rtdNominal: this.rtdNominal,
            refResistor: this.refResistor,
        })

        await this.sensor.clearFaults()
        await this.sensor.init()
    }

    async read(): Promise<ITemperatureSensorReadResult> {
        const value = await this.sensor.getTemperature()
        const error = await this.readErrorString()

        return {
            type: EDeviceTypes.TemperatureSensor,
            name: this.name,
            value,
            error,
        }
    }

    async release(): Promise<void> {
        await this.sensor.clearFaults()
        this.sensor = undefined
    }

    async readErrorString(): Promise<string | null> {
        const faults = await this.sensor.getFaults()
        return (
            Object.entries(faults).reduce((result: string, [key, value]: [string, boolean]) => {
                return value ? (result += `${result ? ', ' : ''}${key}`) : result
            }, '') || null
        )
    }
}

export default TemperatureSensorMAX31865
