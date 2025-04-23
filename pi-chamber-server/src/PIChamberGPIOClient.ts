import { Socket } from 'node:net'
import type { TConfig } from '../../config-reader/readConfig.types.ts'
import callbackAsyncWrapper from '../../utils/callbackAsyncWrapper.ts'
import EventEmitter from 'node:events'
import type { TBaseMessage } from '../../msg-schema/BaseMessage.ts'
import parseMessage from '../../msg-schema/messageParser.ts'
import { TYPES, createPingMessage, type TPingMessage } from '../../msg-schema/PingPongMessage.ts'

export default class PIChamberGPIOClient extends EventEmitter {
    private reconnectMS: number = 1000
    private reconnectTimeoutId: NodeJS.Timeout
    private pingMS: number = 5000
    private pingTimeoutId: NodeJS.Timeout
    private config: TConfig
    private client: Socket
    private currentPingMsg: TPingMessage

    constructor(config: TConfig) {
        super()
        this.config = config
    }

    async send(data: string) {
        if (this.client.readyState === 'open') {
            await callbackAsyncWrapper(handler => this.client.write(data, handler))
        }
    }

    async sendMessage(msg: TBaseMessage) {
        await this.send(JSON.stringify(msg) + '\n')
    }

    private async connect() {
        console.log('PIChamberGPIOClient connecting')
        await callbackAsyncWrapper(handler => this.client.connect(this.config.general.gpio_server_sock, handler))
    }

    async start() {
        this.client = new Socket()

        this.client.on('connect', () => {
            console.log('PIChamberGPIOClient connected')
        })

        this.client.on('data', data => {
            console.log(`PIChamberGPIOClient received data`)
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

        this.client.on('end', () => {
            console.log('PIChamberGPIOClient connection end')
            clearTimeout(this.reconnectTimeoutId)

            this.reconnectTimeoutId = setTimeout(async () => {
                await this.connect()
            }, this.reconnectMS)
        })

        this.client.on('error', err => {
            console.error('PIChamberGPIOClient error:', err)
        })

        this.client.on('close', hadError => {
            console.log(`PIChamberGPIOClient close "${hadError ? 'with error' : 'without error'}"`)

            if (hadError) {
                clearTimeout(this.reconnectTimeoutId)

                this.reconnectTimeoutId = setTimeout(async () => {
                    await this.connect()
                }, this.reconnectMS)
            }
        })

        await this.connect()

        this.ping()
    }

    async stop() {
        this.removeAllListeners()
        clearTimeout(this.reconnectTimeoutId)
        clearTimeout(this.pingTimeoutId)
        this.client.destroy()
    }

    private ping() {
        this.currentPingMsg = createPingMessage()
        this.sendMessage(this.currentPingMsg)
        this.pingTimeoutId = setTimeout(() => this.ping(), this.pingMS)
    }

    private processMessge(msgString: string) {
        const trimmed = msgString.trim()

        if (trimmed) {
            const msg = parseMessage(trimmed)
            if (msg.type === TYPES.PONG) {
                if (msg.uid !== this.currentPingMsg.uid) {
                    this.emit('error', 'Wrong ping uid')
                }
            } else {
                this.emit('messsage', msg)
            }
        }
    }
}
