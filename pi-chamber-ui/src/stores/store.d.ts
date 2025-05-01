import type { Message } from '../../../msg-schema/BaseMessage'

export interface IStoreWithMessageHandler {
    handleMessage: TMessageHandler
}

export interface IStoreUpdateDeviceByName<T> {
    updateByName: (newDevice: T) => void
}

export type TMessageHandler = (message: Message.TMessage) => viod
