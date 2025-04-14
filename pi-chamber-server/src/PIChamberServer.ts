import * as net from 'node:net'
import type { TConfig } from '../../utils/readConfig.ts'
import WebServer from "./WebServer.ts"

export default class PIChamberServer {
    private config: TConfig
    private webServer: WebServer

    constructor(config: TConfig) {
        this.config = config
        this.webServer = new WebServer(config.web_server)
    }

    async start() {
        const SOCKET_PATH = '/tmp/pi-chamb.sock'
        let currentTemp = [];


        const client = net.createConnection(SOCKET_PATH, () => {
            console.log('Подключено к серверу')

            // Отправляем сообщение
            // Чтение температуры каждую секунду
            setInterval(() => {
                client.write('Привет, сервер!')
            }, 1000)

        });

        client.on('data', (data) => {
            const str = data.toString()
            console.log(`Получен ответ: ${str}`)
            this.webServer.broadcast(str)
            currentTemp = JSON.parse(str)
        });

        client.on('end', () => {
            console.log('Отключено от сервера')
        });

        client.on('error', (err) => {
            console.error('Ошибка клиента:', err)
        });

        await this.webServer.start()
    }

    async stop() {
        await this.webServer.stop()
    }
}