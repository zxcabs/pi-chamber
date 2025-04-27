import { Message } from '../../../msg-schema/BaseMessage'

export default function createStoreMessageHandler<TMessage extends Message.TMessage>(
    type: Message.TTypedName,
    cb: (message: TMessage) => void,
): (message: Message.TMessage) => void {
    return function handleMessage(message) {
        if (`${message.type}:${message.name}` !== type) return
        cb(message as TMessage)
    }
}
