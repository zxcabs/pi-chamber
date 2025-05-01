import type { TResponseSetPWMMessage } from '../../../msg-schema/SetPWMDeviceMessage.ts'
import {
    NAME_STATUS,
    type TEventStatusMessage,
    type TResponseStatusMessage,
} from '../../../msg-schema/StatusMessage.ts'
import { NAME_SET_PWM } from '../../../msg-schema/SetPWMDeviceMessage.ts'
import {
    NAME_TOGGLE_GPIO_DEVICE,
    type TResponseToggleGPIODeviceMessage,
} from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import {
    NAME as NAME_SET_GPIO_DEVICES,
    type TResponseMessage as TResponseSetGPIODevicesMessage,
} from '../../../msg-schema/SetGPIODevicesValueMessage.ts'
import {
    NAME as NAME_SET_HEATING_CHAMBER_DEVICES_VALUE,
    type TRequestMessage as TRequestSetHeatingChamberDevicesValueMessage,
} from '../../../msg-schema/SetHeatingChamberDevicesValue.ts'
import {
    HEATING_CHAMBER_DEVICE_FAN,
    HEATING_CHAMBER_DEVICE_LIGHT,
} from '../../../msg-schema/schemas/HeatingChamberState.ts'
import {
    NAME as NAME_START_SHEDULER_TASK,
    type TRequestMessage as TRequesStartShedulerTasktMessage,
    createErrorMessage as createErrorStartShedulerTaskMessage,
} from '../../../msg-schema/StartShedulerTask.ts'
import {
    NAME as NAME_STOP_SHEDULER_TASK,
    type TRequestMessage as TRequesStopShedulerTasktMessage,
    createErrorMessage as createErrorStopShedulerTaskMessage,
} from '../../../msg-schema/StopShedulerTask.ts'
import type { IGPIODeviceResult } from '../devices/types/IGPIODevice.type.ts'
import type { IPWMDeviceResult } from '../devices/types/IPWMDevice.type.ts'
import type { ITemperatureSensorReadResult } from '../devices/types/ITemperatureSensor.type.ts'
import type HeatingChamber from './HeatingChamber.ts'
import { createEventHeatingChamberSateMessage } from '../../../msg-schema/HeatingChamberMessage.ts'
import MessageBusBridge from '../../../msg-bus/MessageBusBridge.ts'
import type MessageBus from '../../../msg-bus/MessageBus.ts'

export default class HeatingChamberBridge extends MessageBusBridge {
    constructor(
        private chamber: HeatingChamber,
        ebus: MessageBus,
    ) {
        super(ebus)

        this.setupBusNamedEventListener(NAME_STATUS, this.handleStatusMessage)

        this.setupBusNamedResponseListener(NAME_STATUS, this.handleStatusMessage)
        this.setupBusNamedResponseListener(NAME_SET_PWM, this.handleSetPWMMessage)
        this.setupBusNamedResponseListener(NAME_TOGGLE_GPIO_DEVICE, this.handleToggleGPIODeviceMessage)
        this.setupBusNamedResponseListener(NAME_SET_GPIO_DEVICES, this.handleSetGPIODevicesValueMessage)

        this.setupBusNamedRequestListener(NAME_SET_HEATING_CHAMBER_DEVICES_VALUE, this.handleSetDevicesValue)
        this.setupBusNamedRequestListener(NAME_START_SHEDULER_TASK, this.handleStartShedulerTask)
        this.setupBusNamedRequestListener(NAME_STOP_SHEDULER_TASK, this.handleStopShedulerTask)
    }

    private handleStatusMessage(message: TResponseStatusMessage | TEventStatusMessage) {
        const temperatureSensorNames = this.chamber.config.temperature_sensors
        const temperatureSensorsData = message.payload.temperature_sensors

        temperatureSensorNames?.forEach(name => {
            temperatureSensorsData?.forEach(data => {
                if (data.name === name) {
                    this.chamber.state.updateTemperatureSensorStatus(data as ITemperatureSensorReadResult)
                }
            })
        })

        const lightDeviceNames = this.chamber.config.lights
        const gpioDevicesData = message.payload.gpio_devices

        lightDeviceNames?.forEach(name => {
            gpioDevicesData?.forEach(data => {
                if (data.name === name) {
                    this.chamber.state.updateLightDeviceStatus(data as IGPIODeviceResult)
                }
            })
        })

        const fanDeviceNames = this.chamber.config.fans
        fanDeviceNames?.forEach(name => {
            gpioDevicesData?.forEach(data => {
                if (data.name === name) {
                    this.chamber.state.updataFanDeviceStatus(data as IGPIODeviceResult)
                }
            })
        })

        const heaterDeviceNames = this.chamber.config.heaters
        const pwmDevicesData = message.payload.pwm_devices

        heaterDeviceNames?.forEach(name => {
            pwmDevicesData?.forEach(data => {
                if (data.name === name) {
                    this.chamber.state.updataHeaterDeviceStatus(data as IPWMDeviceResult)
                }
            })
        })

        this.emitState()
    }

    private handleSetPWMMessage(message: TResponseSetPWMMessage) {
        const heaterDeviceNames = this.chamber.config.heaters
        const pwmDevicesData = message.payload.device

        heaterDeviceNames?.forEach(name => {
            if (pwmDevicesData.name === name) {
                this.chamber.state.updataHeaterDeviceStatus(pwmDevicesData as IPWMDeviceResult)
            }
        })

        this.emitState()
    }

    private handleToggleGPIODeviceMessage(message: TResponseToggleGPIODeviceMessage) {
        const lightDeviceNames = this.chamber.config.lights
        const gpioDeviceData = message.payload.device

        lightDeviceNames?.forEach(name => {
            if (gpioDeviceData.name === name) {
                this.chamber.state.updateLightDeviceStatus(gpioDeviceData as IGPIODeviceResult)
            }
        })

        const fanDeviceNames = this.chamber.config.fans
        fanDeviceNames?.forEach(name => {
            if (gpioDeviceData.name === name) {
                this.chamber.state.updataFanDeviceStatus(gpioDeviceData as IGPIODeviceResult)
            }
        })

        this.emitState()
    }

    private handleSetGPIODevicesValueMessage(message: TResponseSetGPIODevicesMessage) {
        const lightDeviceNames = this.chamber.config.lights

        const fanDeviceNames = this.chamber.config.fans
        const gpioDevicesData = message.payload.devices

        gpioDevicesData.forEach(gpioDeviceData => {
            lightDeviceNames?.forEach(name => {
                if (gpioDeviceData.name === name) {
                    this.chamber.state.updateLightDeviceStatus(gpioDeviceData as IGPIODeviceResult)
                }
            })

            fanDeviceNames?.forEach(name => {
                if (gpioDeviceData.name === name) {
                    this.chamber.state.updataFanDeviceStatus(gpioDeviceData as IGPIODeviceResult)
                }
            })
        })

        this.emitState()
    }

    private handleSetDevicesValue(message: TRequestSetHeatingChamberDevicesValueMessage) {
        const chamberName = this.chamber.name
        const messageDevicesValue = message.payload.devices.filter(device => device.chamber === chamberName)

        messageDevicesValue.forEach(device => {
            const deviceName = device.name
            if (deviceName === HEATING_CHAMBER_DEVICE_LIGHT) {
                this.chamber.setLightValue(device.value)
            }

            if (deviceName === HEATING_CHAMBER_DEVICE_FAN) {
                this.chamber.setFanValue(device.value)
            }
        })
    }

    private handleStartShedulerTask(message: TRequesStartShedulerTasktMessage) {
        this.sendMessage(
            createErrorStartShedulerTaskMessage(message.uid, {
                reason: 'Should implement',
            }),
        )
    }

    private handleStopShedulerTask(message: TRequesStopShedulerTasktMessage) {
        this.sendMessage(
            createErrorStopShedulerTaskMessage(message.uid, {
                reason: 'Should implement',
            }),
        )
    }

    emitState() {
        const state = this.chamber.state.getCurrentState()
        this.chamber.onStateUpdate(state)

        this.sendMessage(
            createEventHeatingChamberSateMessage({
                name: this.chamber.config.name,
                state,
            }),
        )
    }
}
