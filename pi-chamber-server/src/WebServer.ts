import { Server } from 'node:http'
import express, { type Application } from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import type { TWebServerConfig } from '../../utils/readConfig.ts'
import callbackAsyncWrapper from '../../utils/callbackAsyncWrapper.ts'

export default class WebServer {
    private config: TWebServerConfig
    private app: Application
    private server: Server
    private wss: WebSocketServer

    constructor(config: TWebServerConfig) {
        this.config = config

        this.app = express()
        this.app.use(express.static(config.ui_dir))
    }

    async start() {
        this.server = await callbackAsyncWrapper((handle) => {
            const server: Server = this.app.listen(this.config.port, (err) => {
                handle(err, server)
            })
        })

        console.log(`HTTP server running on http://localhost:${this.config.port}`)

        this.wss = new WebSocketServer({ server: this.server, path: '/ws' });

        this.wss.on('connection', (ws: WebSocket) => {
            console.log('New WebSocket connection');

            // Обработка закрытия соединения
            ws.on('close', () => {
                console.log('WebSocket connection closed');
            });
        });
    }

    async broadcast(data: string) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

    async stop() {
        this.server.closeAllConnections()
        await callbackAsyncWrapper((handler) => this.server.close(handler))
        this.server = null
        this.wss = null
    }
}