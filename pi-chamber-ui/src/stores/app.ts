import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { devices, handleMessage as devicesHandler } from './devices'
import type { Message } from '../../../msg-schema/BaseMessage'
import { chambers, handleMessage as chambersHandler } from './chambers'

export interface IAppStore {
    devices: typeof devices
    chambers: typeof chambers
}

export type TAppStore = Writable<IAppStore>

export const appStore: TAppStore = writable<IAppStore>({
    devices: devices,
    chambers: chambers,
})

export const handleMessage = (message: Message.TMessage) => {
    devicesHandler(message)
    chambersHandler(message)
}
