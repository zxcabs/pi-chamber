import type { TConfig } from '../../utils/readConfig.ts'
import PIChamberGPIOClient from "./PIChamberGPIOClient.ts"
import WebServer from "./WebServer.ts"

export default class PIChamberServer {
    private config: TConfig
    private webServer: WebServer
    private gpioClient: PIChamberGPIOClient

    constructor(config: TConfig) {
        this.config = config
        this.webServer = new WebServer(config.web_server)
        this.gpioClient = new PIChamberGPIOClient(config)
    }

    async start() {
        await this.gpioClient.start()
        await this.webServer.start()
    }

    async stop() {
        await this.gpioClient.stop()
        await this.webServer.stop()
    }
}