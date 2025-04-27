import type { z } from 'zod'
import { Message } from '../msg-schema/BaseMessage.ts'
import type MessageBus from './MessageBus.ts'
import { type TBusMessageType } from './MessageBus.ts'

export default class MessageBusBridge {
    private readonly unsubscribers: (() => void)[] = []

    constructor(protected readonly bus: MessageBus) {}

    protected registerUnsubscriber(unsubscriber: () => void): void {
        this.unsubscribers.push(unsubscriber)
    }

    public setupBusListener<T extends Message.TMessage = Message.TMessage>(
        type: TBusMessageType,
        handler: (msg: T) => void,
    ): void {
        const unsubscribe = this.bus.on(type, handler.bind(this))
        this.registerUnsubscriber(unsubscribe)
    }

    public setupBusNamedRequestListener<TMessage extends Message.TRequestMessage>(
        name: Message.TName,
        handler: (msg: TMessage) => void,
    ): void {
        this.setupBusListener(`${Message.TYPE_REQUEST}:${name}`, handler)
    }

    public setupBusNamedResponseListener<TMessage extends Message.TResponseMessage>(
        name: Message.TName,
        handler: (msg: TMessage) => void,
    ): void {
        this.setupBusListener(`${Message.TYPE_RESPONSE}:${name}`, handler)
    }

    public setupBusNamedEventListener<TMessage extends Message.TEventMessage>(
        name: Message.TName,
        handler: (msg: TMessage) => void,
    ): void {
        this.setupBusListener(`${Message.TYPE_EVENT}:${name}`, handler)
    }

    protected handlerWithSchemaParse<T extends Message.TMessage>(
        schema: Message.TMessageSchemas,
        handler: (message: T) => void,
    ): (message: Message.TMessage) => void {
        return message => {
            const result = Message.safeParseMessage(message, schema)

            if (result.success) {
                handler(result.data as T)
            } else {
                console.error(result.error)
            }
        }
    }

    public sendMessage(message: Message.TMessage) {
        this.bus.emit(message)
    }

    public release(): void {
        this.unsubscribers.forEach(unsubscribe => {
            try {
                unsubscribe()
            } catch (error) {
                console.error('Error during unsubscription:', error)
            }
        })
        this.unsubscribers.length = 0
    }
}
