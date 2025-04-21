import type { TBaseMessage, TBaseMessageType } from '../../../msg-schema/BaseMessage.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'

export abstract class BaseApiHandler<TMessage extends TBaseMessage = TBaseMessage> {
    protected readonly ctx: PIChamberGPIO
    private readonly messageType: TBaseMessageType
    private messageListener: (msg: TBaseMessage) => void

    constructor(ctx: PIChamberGPIO, messageType: TBaseMessageType) {
        this.ctx = ctx
        this.messageType = messageType
        this.messageListener = this.handleIncomingMessage.bind(this)

        this.registerMessageHandler()
    }

    private registerMessageHandler(): void {
        this.ctx.server.on('message', this.messageListener)
    }

    private unregisterMessageHandler(): void {
        this.ctx.server.off('message', this.messageListener)
    }

    private handleIncomingMessage(msg: TBaseMessage): void {
        try {
            if (this.shouldHandleMessage(msg)) {
                this.messageHandler(msg as TMessage)
            }
        } catch (error) {
            this.handleError(error, msg)
        }
    }

    protected shouldHandleMessage(msg: TBaseMessage): boolean {
        return msg.type === this.messageType
    }

    protected handleError(error: unknown, message: TBaseMessage): void {
        console.error(`Error processing message ${message.type}:`, error)
    }

    protected abstract messageHandler(message: TMessage): void

    public destroy(): void {
        this.unregisterMessageHandler()
    }
}
