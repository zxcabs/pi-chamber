import EventEmitter from 'node:events'
import { Message } from '../msg-schema/BaseMessage.ts'

export type TBusMessageType = Message.TTypedName | Message.TTypeRequest | Message.TTypeResponse | Message.TTypeEvent

export default class MessageBus {
    private readonly ee: EventEmitter = new EventEmitter()

    on<Type extends TBusMessageType, TMessage>(messageType: Type, callback: (msg: TMessage) => void): () => void {
        this.ee.on(messageType, callback)

        return () => this.off(messageType, callback)
    }

    off<TT extends TBusMessageType, TMessage>(messageType: TT, callback?: (msg: TMessage) => void): void {
        if (callback) {
            this.ee.off(messageType, callback)
        } else {
            this.ee.removeAllListeners(messageType)
        }
    }

    once<TT extends TBusMessageType, TMessage>(messageType: TT, callback: (msg: TMessage) => void): void {
        this.ee.once(messageType, callback)
    }

    emit<TMessage extends Message.TMessage>(message: TMessage): boolean {
        const type = this.ee.emit(message.type, message)

        const namedType: Message.TTypedName = `${message.type}:${message.name}`
        const named = this.ee.emit(namedType, message)

        return type && named
    }

    release(): void {
        this.ee.removeAllListeners()
    }

    listenerCount<TMessageType extends Message.TTypedName>(messageType: TMessageType): number {
        return this.ee.listenerCount(messageType)
    }
}
