import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { devices, handleMessage as devicesHandler } from './devices'
import type { TBaseMessage } from '../../../msg-schema/BaseMessage'

export interface IAppStore {
    devices: typeof devices
}

export type TAppStore = Writable<IAppStore>

export const appStore: TAppStore = writable<IAppStore>({
    devices: devices,
})

export const handleMessage = (message: TBaseMessage) => {
    devicesHandler(message)
}
