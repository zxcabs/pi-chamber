import { existsSync, unlinkSync } from 'node:fs'
import { createServer, Server, Socket } from 'node:net'
import type { TGeneralConfig } from '../../utils/readConfig.ts'
import callbackAsyncWrapper from '../../utils/callbackAsyncWrapper.ts'

class SockServer {
    private config: TGeneralConfig
    private server: Server

    constructor(config: TGeneralConfig) {
        this.config = config
    }

    async start(onClientConnect: Function): Promise<void> {
        if (existsSync(this.config.gpio_server_sock)) {
            unlinkSync(this.config.gpio_server_sock)
        }

        this.server = createServer((connection: Socket) => {
            onClientConnect(connection)

            connection.on('end', () => {
                console.log('Client disconnected');
            });
        });

        this.server.on('error', (err) => {
            console.error('Server error', err)
        });

        await callbackAsyncWrapper((handler) => this.server.listen(this.config.gpio_server_sock, handler))

        console.log(`Server listen on ${this.config.gpio_server_sock}`)
    }

    async stop(): Promise<void> {
        await callbackAsyncWrapper((handler) => this.server.close(handler))

        if (existsSync(this.config.gpio_server_sock)) {
            unlinkSync(this.config.gpio_server_sock)
        }
    }
}

export default SockServer