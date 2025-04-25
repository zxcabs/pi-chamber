import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import type { TBaseMessage } from '../../../msg-schema/BaseMessage'
import { TYPES as STATUS_TYPES, type TRsStatusMessage } from '../../../msg-schema/StatusMessage'
import { TYPES as TOGGLE_TYPES, type TRsToggleGPIODeviceMessage } from '../../../msg-schema/ToggleGPIODeviceMessage'
import { TYPES as PWM_TYPES, type TRsSetPWMMessage } from '../../../msg-schema/PWMDeviceMessage'
import createStoreMessageHandler from '../utils/createStoreMessageHandler'

export type TDevice = TBaseDevice
export type TDevices = Writable<TDevice[]>
export const devices: TDevices = writable([])

const updateDevice =
    <T extends TDevice>(newDevice: T) =>
    (currentDevices: TDevice[]) => {
        const index = currentDevices.findIndex(d => d.name === newDevice.name)

        if (index !== -1 && currentDevices[index].time <= newDevice.time) {
            return [...currentDevices.slice(0, index), newDevice, ...currentDevices.slice(index + 1)]
        }

        return currentDevices
    }

const handleSingleDeviceUpdate = <T extends TDevice>(device: T) => {
    devices.update(updateDevice(device))
}

const handlers = [
    createStoreMessageHandler<TRsStatusMessage>(STATUS_TYPES.RS_STATUS, message => {
        const { temperature_sensors = [], gpio_devices = [], pwm_devices = [] } = message.payload
        devices.set([...temperature_sensors, ...gpio_devices, ...pwm_devices])
    }),
    createStoreMessageHandler<TRsStatusMessage>(STATUS_TYPES.EVENT_STATUS, message => {
        const { temperature_sensors = [], gpio_devices = [], pwm_devices = [] } = message.payload
        const devicesStatus = [...temperature_sensors, ...gpio_devices, ...pwm_devices]

        devices.update(current => devicesStatus.reduce((acc, device) => updateDevice(device)(acc), current))
    }),

    createStoreMessageHandler<TRsToggleGPIODeviceMessage>(TOGGLE_TYPES.RS_TOGGLE_GPIO_DEVICE, message =>
        handleSingleDeviceUpdate(message.payload),
    ),
    createStoreMessageHandler<TRsSetPWMMessage>(PWM_TYPES.RS_SET_PWM, message =>
        handleSingleDeviceUpdate(message.payload),
    ),
]

export const handleMessage = (message: TBaseMessage) => {
    handlers.forEach(handler => handler(message))
}
