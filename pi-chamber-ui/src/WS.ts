import type { Writable } from 'svelte/store'
import callbackAsyncWrapper from '../../utils/callbackAsyncWrapper'

export default class WS {
    private storeHandlers = new Set<Function>()
    private static instance: WS
    private socket?: WebSocket
    private reconnectTimeout: number = 2000

    static async createConnection(): Promise<WebSocket> {
        return await callbackAsyncWrapper<WebSocket>(handler => {
            const ws = new WebSocket(`ws://${window.location.host}/ws`)

            const clear = () => {
                ws.onopen = null
                ws.onerror = null
            }

            ws.onopen = () => {
                clear()
                handler(undefined, ws)
            }

            ws.onerror = () => {
                clear()
                handler(new Error('Connection error'))
            }
        })
    }

    public static getInstance(): WS {
        if (!WS.instance) {
            WS.instance = new WS()
        }
        return WS.instance
    }

    constructor() {}

    async connect() {
        try {
            this.socket = await WS.createConnection()

            this.socket.onmessage = this.handleMessage.bind(this)
            this.socket.onerror = this.handleError.bind(this)
            this.socket.onclose = this.handleClose.bind(this)
        } catch (e) {
            this.reconnect()
        }
    }

    private reconnect() {
        console.log('Reconnect after', this.reconnectTimeout)
        setTimeout(() => {
            this.connect()
        }, this.reconnectTimeout)
    }

    public registerStoreHandler(handler: Function) {
        this.storeHandlers.add(handler)
    }

    public send(data: Object) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data))
        } else {
            console.error('WebSocket is not connected')
        }
    }

    private handleMessage(event: MessageEvent) {
        const message = JSON.parse(event.data)
        this.storeHandlers.forEach(handler => handler(message))
    }

    private handleError(event: Event) {
        console.error('WebSocket error:', event)
        this.reconnect()
    }

    private handleClose() {
        console.log('WebSocket connection closed')
        this.reconnect()
    }
}
