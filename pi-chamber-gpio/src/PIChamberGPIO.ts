import { type TConfig } from '../../utils/readConfig.ts'
import TemperatureSensors from './TemperatureSensors.ts'
import PIChamberGPIOServer from './PIChamberGPIOServer.ts'
import type { TBaseMessage } from '../../msg-schema/BaseMessage.ts'
import { createRsStatusMessage, TYPES as STATUS_TYPES } from '../../msg-schema/StatusMessage.ts'

class PIChamberGPIO {
    config: TConfig
    temperatureSensors: TemperatureSensors
    server: PIChamberGPIOServer
    intervalId: any

    constructor(config: TConfig) {
        this.config = config
        this.temperatureSensors = new TemperatureSensors(config.temperature_sensors)
        this.server = new PIChamberGPIOServer(config.general)
    }

    async start() {
        await this.server.start()

        await this.temperatureSensors.connect()

        this.server.on('messsage', async (msg: TBaseMessage) => {
            if (msg.type === STATUS_TYPES.RQ_STATUS) {
                const tempData = await this.temperatureSensors.read()
                const statusMsg = createRsStatusMessage({
                    temperature_sensors: tempData,
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
    }
}

export default PIChamberGPIO
