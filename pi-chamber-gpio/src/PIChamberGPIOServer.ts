import { existsSync, unlinkSync } from 'node:fs'
import { Server, Socket } from 'node:net'
import EventEmitter from 'node:events'
import type { TGeneralConfig } from '../../config-reader/readConfig.types.ts'
import callbackAsyncWrapper from '../../utils/callbackAsyncWrapper.ts'
import parceMessage from '../../msg-schema/messageParcer.ts'
import type { TBaseMessage } from '../../msg-schema/BaseMessage.ts'

export default class PIChamberGPIOServer extends EventEmitter {
    private config: TGeneralConfig
    private server: Server
    private clients: Set<Socket> = new Set()

    constructor(config: TGeneralConfig) {
        super()
        this.config = config
    }

    async start(): Promise<void> {
        if (existsSync(this.config.gpio_server_sock)) {
            unlinkSync(this.config.gpio_server_sock)
        }

        this.server = new Server()

        this.server.on('connection', (connection: Socket) => {
            this.clients.add(connection)
            console.log('Client connected')
            this.emit('connection', connection)

            connection.on('data', data => {
                this.emit('data', data)

                const msgs = data.toString().split('\n')

                try {
                    if (msgs?.length) {
                        msgs.forEach(msg => {
                            this.processMessge(msg)
                        })
                    }
                } catch (error) {
                    this.emit('error', error)
                }
            })

            connection.on('end', () => {
                this.clients.delete(connection)
                console.log('Client disconnected')
            })
        })

        this.server.on('error', err => {
            console.error('Server error', err)
        })

        this.server.on('listening', () => {
            console.log('Server listening')
        })

        this.server.on('close', () => {
            console.log('Server close')
        })

        await callbackAsyncWrapper(handler => this.server.listen(this.config.gpio_server_sock, handler))

        console.log(`Server listen on "${this.config.gpio_server_sock}"`)
    }

    async stop(): Promise<void> {
        await Promise.all(
            [...this.clients].map(client =>
                callbackAsyncWrapper(handler => {
                    if (client.connecting) {
                        client.end(handler)
                    } else {
                        handler()
                    }
                }),
            ),
        )

        this.removeAllListeners()
        if (existsSync(this.config.gpio_server_sock)) {
            unlinkSync(this.config.gpio_server_sock)
        }
    }

    broadcast(data: string) {
        this.clients.forEach(client => {
            client.write(data + '\n')
        })
    }

    sendMessage(msg: TBaseMessage) {
        this.broadcast(JSON.stringify(msg))
    }

    private processMessge(msgString: string) {
        const trimmed = msgString.trim()

        if (trimmed) {
            try {
                this.emitMessage(parceMessage(trimmed))
            } catch (e) {
                console.error('Error on parse message: ', e)
            }
        }
    }

    emitMessage(msg: TBaseMessage): void {
        this.emit('message', msg)
    }
}
