import { Socket } from 'node:net'
import type { TConfig } from '../../utils/readConfig.ts'
import callbackAsyncWrapper from '../../utils/callbackAsyncWrapper.ts'
import EventEmitter from 'node:events'

export default class PIChamberGPIOClient extends EventEmitter {
    private reconnectMS: number = 1000
    private reconnectTimeoutId: NodeJS.Timeout
    private config: TConfig
    private client: Socket

    constructor(config: TConfig) {
        super()
        this.config = config
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
            const str = data.toString()
            console.log(`PIChamberGPIOClient received data: ${str}`)
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
            console.log(`PIChamberGPIOClient close "${hadError ? 'with error' : 'without erro'}"`)

            if (hadError) {
                clearTimeout(this.reconnectTimeoutId)

                this.reconnectTimeoutId = setTimeout(async () => {
                    await this.connect()
                }, this.reconnectMS)
            }
        })

        await this.connect()
    }

    async stop() {
        clearTimeout(this.reconnectTimeoutId)
        this.client.destroy()
    }
}
