import type PIChamberGPIO from '../PIChamberGPIO.ts'
import type { TBusMessageType } from '../../../msg-bus/MessageBus.ts'
import { Message } from '../../../msg-schema/BaseMessage.ts'

export abstract class BaseApiHandler<TMessage extends Message.TMessage = Message.TMessage> {
    protected readonly ctx: PIChamberGPIO
    private readonly messageType: TBusMessageType
    private messageListener: (msg: TMessage) => void

    constructor(ctx: PIChamberGPIO, name: Message.TName, type: Message.TType = Message.TYPE_REQUEST) {
        this.ctx = ctx
        this.messageType = `${type}:${name}`
        this.messageListener = this.handleIncomingMessage.bind(this)

        this.registerMessageHandler()
    }

    private registerMessageHandler(): void {
        this.ctx.ebus.on(this.messageType, this.messageListener)
    }

    private unregisterMessageHandler(): void {
        this.ctx.ebus.off(this.messageType, this.messageListener)
    }

    private handleIncomingMessage(msg: TMessage): void {
        try {
            this.messageHandler(msg as TMessage)
        } catch (error) {
            this.handleError(error, msg)
        }
    }

    protected handleError(error: unknown, message: TMessage): void {
        console.error(`Error processing message ${message.type}:`, error)
    }

    protected abstract messageHandler(message: TMessage): void

    public destroy(): void {
        this.unregisterMessageHandler()
    }
}
