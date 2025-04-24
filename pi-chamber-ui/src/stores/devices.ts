import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import type { TBaseMessage } from '../../../msg-schema/BaseMessage'
import { TYPES as STATUS_TYPES, type TRsStatusMessage } from '../../../msg-schema/StatusMessage'
import { TYPES as TOGGLE_TYPES, type TRsToggleGPIODeviceMessage } from '../../../msg-schema/ToggleGPIODeviceMessage'
import { TYPES as PWM_TYPES, type TRsSetPWMMessage } from '../../../msg-schema/PWMDeviceMessage'
import createStoreMessageHandler from '../utils/createStoreMessageHandler'

export type TDevices = Writable<TBaseDevice[]>

export const devices: TDevices = writable([])

const handlers = [
    createStoreMessageHandler<TRsStatusMessage>(STATUS_TYPES.RS_STATUS, message => {
        const status = message.payload
        devices.set([
            ...(status?.temperature_sensors || []),
            ...(status?.gpio_devices || []),
            ...(status?.pwm_devices || []),
        ])
    }),
    createStoreMessageHandler<TRsStatusMessage>(STATUS_TYPES.EVENT_STATUS, message => {
        const status = message.payload
        const devicesStatus = [
            ...(status?.temperature_sensors || []),
            ...(status?.gpio_devices || []),
            ...(status?.pwm_devices || []),
        ]

        devices.update(values => {
            return devicesStatus.reduce((acc, device) => {
                const index = acc.findIndex(({ name }) => name === device.name)

                if (index < 0 || acc[index].time > device.time) return acc

                return [...acc.slice(0, index), device, ...acc.slice(index + 1)]
            }, values)
        })
    }),

    createStoreMessageHandler<TRsToggleGPIODeviceMessage>(TOGGLE_TYPES.RS_TOGGLE_GPIO_DEVICE, message => {
        const device = message.payload

        devices.update(values => {
            const index = values.findIndex(({ name }) => name === device.name)

            if (index < 0 || index < 0 || values[index].time > device.time) return values
            return [...values.slice(0, index), device, ...values.slice(index + 1)]
        })
    }),
    createStoreMessageHandler<TRsSetPWMMessage>(PWM_TYPES.RS_SET_PWM, message => {
        const device = message.payload

        devices.update(values => {
            const index = values.findIndex(({ name }) => name === device.name)

            if (index < 0 || index < 0 || values[index].time > device.time) return values
            return [...values.slice(0, index), device, ...values.slice(index + 1)]
        })
    }),
]

export const handleMessage = (message: TBaseMessage) => {
    handlers.forEach(handler => handler(message))
}
