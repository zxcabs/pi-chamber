import createDevicesStore, { type TDevicesStore } from './devices'
import createChambersStore, { type TChambersStore } from './chambers'
import type { IStoreWithMessageHandler, TMessageHandler } from './store'

export type TAppStore = IStoreWithMessageHandler & {
    devices: IStoreWithMessageHandler & TDevicesStore
    chambers: IStoreWithMessageHandler & TChambersStore
    handleMessage: TMessageHandler
}

export default function createStore(): TAppStore {
    const devicesStore = createDevicesStore()
    const chambersStore = createChambersStore()

    const handleMessage: TMessageHandler = message => {
        devicesStore.handleMessage(message)
        chambersStore.handleMessage(message)
    }

    return {
        devices: devicesStore,
        chambers: chambersStore,
        handleMessage,
    }
}
