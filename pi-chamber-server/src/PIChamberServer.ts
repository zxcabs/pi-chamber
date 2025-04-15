import type { TBaseMessage } from '../../msg-schema/BaseMessage.ts'
import type { TConfig } from '../../utils/readConfig.ts'
import PIChamberGPIOClient from './PIChamberGPIOClient.ts'
import WebServer from './WebServer.ts'
import { createRqStatusMessage } from '../../msg-schema/StatusMessage.ts'

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

        this.gpioClient.on('messsage', (msg: TBaseMessage) => {
            this.webServer.broadcast(JSON.stringify(msg))
        })

        this.gpioClient.on('error', error => {
            console.error(error)
        })

        setInterval(() => {
            this.gpioClient.sendMessage(createRqStatusMessage())
        }, 1000)
    }

    async stop() {
        await this.gpioClient.stop()
        await this.webServer.stop()
    }
}
