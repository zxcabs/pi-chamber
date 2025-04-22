import type { TTemeperatureSensorsConfig, TTemeperatureSensorConfig } from '../../utils/readConfig.ts'
import type { ITemperatureSensor, ITemperatureSensorReadResult } from './devices/types/ITemperatureSensor.type.ts'
import TemperatureSensorMAX31865 from './devices/TemperatureSensorMAX31865.ts'

const SENSORS_TYPE_CONT_MAP = {
    MAX31865: TemperatureSensorMAX31865,
}

class TemperatureSensors {
    private sensors: Array<ITemperatureSensor>

    constructor(config: TTemeperatureSensorsConfig) {
        this.sensors = config.reduce((accum, sensorConfig: TTemeperatureSensorConfig) => {
            const SensorContructor = SENSORS_TYPE_CONT_MAP[sensorConfig.type]

            if (!SensorContructor) {
                console.error(
                    `Unknown temperature sensor type ${sensorConfig.type} for sensor name ${sensorConfig.name}`,
                )
            }

            accum.push(new SensorContructor(sensorConfig))
            return accum
        }, [])
    }

    async connect(): Promise<void> {
        await Promise.all(this.sensors.map(sensor => sensor.connect()))
    }

    async readAll(): Promise<Array<ITemperatureSensorReadResult>> {
        return await Promise.all(this.sensors.map(sensor => sensor.read()))
    }

    async release(): Promise<void> {
        await Promise.all(this.sensors.map(sensor => sensor.release()))
    }
}

export default TemperatureSensors
