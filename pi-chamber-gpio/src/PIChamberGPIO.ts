import { type TConfig } from '../../utils/readConfig.ts'
import TemperatureSensors from './TemperatureSensors.ts'
import PIChamberGPIOServer from './PIChamberGPIOServer.ts'
import type { TBaseMessage } from '../../msg-schema/BaseMessage.ts'
import { createRsStatusMessage, TYPES as STATUS_TYPES } from '../../msg-schema/StatusMessage.ts'
import { Lights } from './Lights.ts'

class PIChamberGPIO {
    config: TConfig
    server: PIChamberGPIOServer
    temperatureSensors: TemperatureSensors
    lights: Lights

    constructor(config: TConfig) {
        this.config = config
        this.server = new PIChamberGPIOServer(config.general)
        this.temperatureSensors = new TemperatureSensors(config.temperature_sensors)
        this.lights = new Lights(config.lights)
    }

    async start() {
        await this.server.start()
        await this.temperatureSensors.connect()
        await this.lights.connect()

        await this.lights.write('chamber light', 1)

        this.server.on('messsage', async (msg: TBaseMessage) => {
            if (msg.type === STATUS_TYPES.RQ_STATUS) {
                const tempStatus = await this.temperatureSensors.read()
                const lightsStatus = await this.lights.readAll()

                const statusMsg = createRsStatusMessage({
                    temperature_sensors: tempStatus,
                    lights: lightsStatus,
                })

                this.server.sendMessage(statusMsg)
            }
        })

        this.server.on('error', error => {
            console.error(error)
        })
    }

    async stop() {
        await this.server.stop()
        await this.temperatureSensors.release()
        await this.lights.release()
    }
}

export default PIChamberGPIO
