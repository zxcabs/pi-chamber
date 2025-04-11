import { type TConfig } from '../../utils/readConfig.ts'
import TemperatureSensors from "./TemperatureSensors.ts"
import SockServer from "./SockServer.ts"
import type { Socket } from 'node:net'

class PIChamberGPIO {
    config: TConfig
    temperatureSensors: TemperatureSensors
    server: SockServer
    intervalId: any


    constructor(config: TConfig) {
        this.config = config
        this.temperatureSensors = new TemperatureSensors(config.temperature_sensors)
        this.server = new SockServer(config.general)
    }

    async start() {
        await this.server.start((connection: Socket) => {
            console.log('Client connecting')

            connection.on('data', async () => {
                const tempData = await this.temperatureSensors.read()
                connection.write(JSON.stringify(tempData))
            });
        })

        await this.temperatureSensors.connect()
    }

    async stop() {
        await this.server.stop()
        await this.temperatureSensors.release()
    }
}

export default PIChamberGPIO