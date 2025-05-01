import { derived, writable } from 'svelte/store'
import type { Writable, Readable } from 'svelte/store'
import { Message } from '../../../msg-schema/BaseMessage'
import { NAME_STATUS, type TResponseStatusMessage } from '../../../msg-schema/StatusMessage'
import createStoreMessageHandler from '../utils/createStoreMessageHandler'
import {
    NAME_TOGGLE_GPIO_DEVICE,
    type TResponseToggleGPIODeviceMessage,
} from '../../../msg-schema/ToggleGPIODeviceMessage'
import { NAME_SET_PWM, type TResponseSetPWMMessage } from '../../../msg-schema/SetPWMDeviceMessage'
import {
    NAME as NAME_SET_GPIO_DEVICES,
    type TResponseMessage as TResponseSetGPIODevicesMessage,
} from '../../../msg-schema/SetGPIODevicesValueMessage'
import type { IStoreWithMessageHandler, TMessageHandler } from './store'
import createDeviceStore, { type TDevice, type TDeviceStore } from './device'

type TDeviceListStore = Writable<TDeviceStore[]> & {
    updateValue: (device: TDevice) => void
}

const createDevicesStore = (): TDeviceListStore => {
    const store = writable<TDeviceStore[]>()

    const updateValue = (device: TDevice) => {
        store.update((currentDevices = []) => {
            return currentDevices.map(currentDeviceStore => {
                currentDeviceStore.updateByName(device)
                return currentDeviceStore
            })
        })
    }

    return {
        ...store,
        updateValue,
    }
}

export type TDevicesStore = IStoreWithMessageHandler &
    Readable<TDeviceStore[]> & {
        temperatureSensors: TDeviceListStore
        gpioDevices: TDeviceListStore
        pwmDevices: TDeviceListStore
    }

export default function createStore(): TDevicesStore {
    const temperatureSensors = createDevicesStore()
    const gpioDevices = createDevicesStore()
    const pwmDevices = createDevicesStore()

    const devices = derived([temperatureSensors, gpioDevices, pwmDevices], ([$tsensor = [], $gpio = [], $pwm = []]) => [
        ...$tsensor,
        ...$gpio,
        ...$pwm,
    ])

    const handlers: TMessageHandler[] = [
        createStoreMessageHandler<TResponseStatusMessage>(`${Message.TYPE_RESPONSE}:${NAME_STATUS}`, message => {
            const { temperature_sensors = [], gpio_devices = [], pwm_devices = [] } = message.payload

            temperatureSensors.set(temperature_sensors.map(sensor => createDeviceStore(sensor)))
            gpioDevices.set(gpio_devices.map(gpio => createDeviceStore(gpio)))
            pwmDevices.set(pwm_devices.map(pwm => createDeviceStore(pwm)))
        }),
        createStoreMessageHandler<TResponseStatusMessage>(`${Message.TYPE_EVENT}:${NAME_STATUS}`, message => {
            const { temperature_sensors = [], gpio_devices = [], pwm_devices = [] } = message.payload

            temperature_sensors.forEach(newDevice => temperatureSensors.updateValue(newDevice))
            gpio_devices.forEach(newDevice => gpioDevices.updateValue(newDevice))
            pwm_devices.forEach(newDevice => pwmDevices.updateValue(newDevice))
        }),
        createStoreMessageHandler<TResponseSetGPIODevicesMessage>(
            `${Message.TYPE_RESPONSE}:${NAME_SET_GPIO_DEVICES}`,
            message => {
                const { devices } = message.payload

                devices.forEach(newDevice => gpioDevices.updateValue(newDevice))
            },
        ),

        createStoreMessageHandler<TResponseToggleGPIODeviceMessage>(
            `${Message.TYPE_RESPONSE}:${NAME_TOGGLE_GPIO_DEVICE}`,
            message => gpioDevices.updateValue(message.payload.device),
        ),
        createStoreMessageHandler<TResponseSetPWMMessage>(`${Message.TYPE_RESPONSE}:${NAME_SET_PWM}`, message =>
            pwmDevices.updateValue(message.payload.device),
        ),
    ]

    const handleMessage: TMessageHandler = message => {
        handlers.forEach(handler => handler(message))
    }

    return {
        ...devices,
        temperatureSensors,
        gpioDevices,
        pwmDevices,
        handleMessage,
    }
}
