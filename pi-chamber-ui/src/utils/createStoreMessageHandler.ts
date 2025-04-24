import type { TBaseMessage, TBaseMessageType } from '../../../msg-schema/BaseMessage'

export default function createStoreMessageHandler<TMessage extends TBaseMessage>(
    type: TBaseMessageType,
    cb: (message: TMessage) => void,
): (message: TBaseMessage) => void {
    return function handleMessage(message) {
        if (message.type !== type) return
        cb(message as TMessage)
    }
}
