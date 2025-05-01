import { writable, type Writable } from 'svelte/store'
import type { IStoreUpdateDeviceByName } from './store'
import type { TBaseDevice } from '../../../msg-schema/schemas/Device'

export type TDevice = TBaseDevice
export type TDeviceStore = IStoreUpdateDeviceByName<TDevice> & Writable<TDevice> & {}

export default function createStore(data: TDevice): TDeviceStore {
    const store = writable<TDevice>(data)

    const updateByName = (device: TDevice) => {
        store.update(currentDevice => {
            if (currentDevice.name === device.name && currentDevice.time <= device.time) {
                return device
            }

            return currentDevice
        })
    }

    return {
        ...store,
        updateByName,
    }
}
