import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import { Message } from '../../../msg-schema/BaseMessage'
import { NAME_STATUS, type TResponseStatusMessage } from '../../../msg-schema/StatusMessage'
import createStoreMessageHandler from '../utils/createStoreMessageHandler'
import {
    NAME_TOGGLE_GPIO_DEVICE,
    type TResponseToggleGPIODeviceMessage,
} from '../../../msg-schema/ToggleGPIODeviceMessage'
import { NAME_SET_PWM, type TResponseSetPWMMessage } from '../../../msg-schema/SetPWMDeviceMessage'

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
    createStoreMessageHandler<TResponseStatusMessage>(`${Message.TYPE_RESPONSE}:${NAME_STATUS}`, message => {
        const { temperature_sensors = [], gpio_devices = [], pwm_devices = [] } = message.payload
        devices.set([...temperature_sensors, ...gpio_devices, ...pwm_devices])
    }),
    createStoreMessageHandler<TResponseStatusMessage>(`${Message.TYPE_RESPONSE}:${NAME_STATUS}`, message => {
        const { temperature_sensors = [], gpio_devices = [], pwm_devices = [] } = message.payload
        const devicesStatus = [...temperature_sensors, ...gpio_devices, ...pwm_devices]

        devices.update(current => devicesStatus.reduce((acc, device) => updateDevice(device)(acc), current))
    }),

    createStoreMessageHandler<TResponseToggleGPIODeviceMessage>(
        `${Message.TYPE_RESPONSE}:${NAME_TOGGLE_GPIO_DEVICE}`,
        message => handleSingleDeviceUpdate(message.payload.device),
    ),
    createStoreMessageHandler<TResponseSetPWMMessage>(`${Message.TYPE_RESPONSE}:${NAME_SET_PWM}`, message =>
        handleSingleDeviceUpdate(message.payload.device),
    ),
]

export const handleMessage = (message: Message.TMessage) => {
    handlers.forEach(handler => handler(message))
}
