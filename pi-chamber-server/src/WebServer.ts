import { Server } from 'node:http'
import express, { type Application } from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import type { TWebServerConfig } from '../../config-reader/readConfig.types.ts'
import callbackAsyncWrapper from '../../utils/callbackAsyncWrapper.ts'
import EventEmitter from 'node:events'
import safeJsonParse from '../../utils/safeJsonParse.ts'

export default class WebServer extends EventEmitter {
    private config: TWebServerConfig
    private app: Application
    private server: Server
    private wss: WebSocketServer

    constructor(config: TWebServerConfig) {
        super()
        this.config = config

        this.app = express()
        this.app.use(express.static(config.ui_dir))
    }

    async start() {
        this.server = await callbackAsyncWrapper(handle => {
            const server: Server = this.app.listen(this.config.port, err => {
                handle(err, server)
            })
        })

        console.log(`HTTP server running on http://localhost:${this.config.port}`)

        this.wss = new WebSocketServer({ server: this.server, path: '/ws' })

        this.wss.on('connection', (ws: WebSocket) => {
            console.log('New WebSocket connection')

            ws.on('close', () => {
                console.log('WebSocket connection closed')
            })

            ws.on('message', data => {
                this.proccessWSSMEssage(data.toString(), ws)
            })
        })
    }

    async broadcast(data: string) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data)
            }
        })
    }

    async stop() {
        await callbackAsyncWrapper(handler => {
            this.server?.closeAllConnections()
            this.wss?.clients?.forEach(client => client.close())
            this.server?.close(handler)
        })
        this.removeAllListeners()
        this.server = null
        this.wss = null
    }

    private proccessWSSMEssage(msgString: string, ws?: WebSocket) {
        const trimmed = msgString.trim()

        if (!trimmed) return

        const parsedResult = safeJsonParse(trimmed)

        if (parsedResult.success) {
            this.emit('message', parsedResult.data)
        }
    }
}
