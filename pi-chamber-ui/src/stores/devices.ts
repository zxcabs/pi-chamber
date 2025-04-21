import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import type { TBaseMessage } from '../../../msg-schema/BaseMessage'
import { TYPES as STATUS_TYPES, type TRsStatusMessagePayload } from '../../../msg-schema/StatusMessage'
import {
    TYPES as TOGGLE_TYPES,
    type TRsToggleGPIODeviceMessagePayload,
} from '../../../msg-schema/ToggleGPIODeviceMessage'

export type TDevices = Writable<TBaseDevice[]>

export const devices: TDevices = writable([])

export const handleMessage = (message: TBaseMessage) => {
    if (STATUS_TYPES.RS_STATUS === message.type) {
        const status = message.payload as TRsStatusMessagePayload
        devices.set([...(status?.temperature_sensors || []), ...(status?.gpio_devices || [])])
    } else if (STATUS_TYPES.EVENT_STATUS === message.type) {
        const status = message.payload as TRsStatusMessagePayload
        const devicesStatus = [...(status?.temperature_sensors || []), ...(status?.gpio_devices || [])]

        devices.update(values => {
            return devicesStatus.reduce((acc, device) => {
                const index = acc.findIndex(({ name }) => name === device.name)

                if (index < 0 || acc[index].time > device.time) return acc

                return [...acc.slice(0, index), device, ...acc.slice(index + 1)]
            }, values)
        })
    } else if (message.type === TOGGLE_TYPES.RS_TOGGLE_GPIO_DEVICE) {
        const device = message.payload as TRsToggleGPIODeviceMessagePayload

        devices.update(values => {
            const index = values.findIndex(({ name }) => name === device.name)

            if (index < 0 || index < 0 || values[index].time > device.time) return values
            return [...values.slice(0, index), device, ...values.slice(index + 1)]
        })
    }
}
