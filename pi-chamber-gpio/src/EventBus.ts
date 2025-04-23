import EventEmitter from 'node:events'
import type { TBaseMessage, TBaseMessageType } from '../../msg-schema/BaseMessage.ts'

export default class EventBus {
    private readonly ee: EventEmitter = new EventEmitter()

    on<TMessageType extends TBaseMessageType, TMessage extends TBaseMessage>(
        messageType: TMessageType,
        callback: (msg: TMessage) => void,
    ): () => void {
        this.ee.on(messageType, callback)

        return () => this.off(messageType, callback)
    }

    off<TMessageType extends TBaseMessageType, TMessage extends TBaseMessage>(
        messageType: TMessageType,
        callback?: (msg: TMessage) => void,
    ): void {
        if (callback) {
            this.ee.off(messageType, callback)
        } else {
            this.ee.removeAllListeners(messageType)
        }
    }

    once<TMessageType extends TBaseMessageType, TMessage extends TBaseMessage>(
        messageType: TMessageType,
        callback: (msg: TMessage) => void,
    ): void {
        this.ee.once(messageType, callback)
    }

    emit<TMessage extends TBaseMessage>(message: TMessage): boolean {
        return this.ee.emit(message.type, message)
    }

    release(): void {
        this.ee.removeAllListeners()
    }

    listenerCount<TMessageType extends TBaseMessageType>(messageType: TMessageType): number {
        return this.ee.listenerCount(messageType)
    }
}
