import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import type { TBaseMessage } from '../../../msg-schema/BaseMessage'
import { TYPES as STATUS_TYPES, type TRsStatusMessagePayload } from '../../../msg-schema/StatusMessage'

export type TDevices = Writable<TBaseDevice[]>

export const devices: TDevices = writable([])

export const handleMessage = (message: TBaseMessage) => {
    if (message.type === STATUS_TYPES.RS_STATUS) {
        const status = message.payload as TRsStatusMessagePayload
        devices.set([...(status?.temperature_sensors || []), ...(status?.lights || [])])
    }
}
