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
import type { IGPIODeviceResult } from '../devices/types/IGPIODevice.type.ts'
import type { IPWMDeviceResult } from '../devices/types/IPWMDevice.type.ts'
import type { ITemperatureSensorReadResult } from '../devices/types/ITemperatureSensor.type.ts'
import type HeatingChamber from './HeatingChamber.ts'
import { createEventHeatingChamberSateMessage } from '../../../msg-schema/HeatingChamberMessage.ts'
import MessageBusBridge from '../../../msg-bus/MessageBusBridge.ts'
import type MessageBus from '../../../msg-bus/MessageBus.ts'

export default class HeatingChamberBridge extends MessageBusBridge {
    constructor(
        private ctx: HeatingChamber,
        ebus: MessageBus,
    ) {
        super(ebus)

        this.setupBusNamedResponseListener(NAME_STATUS, this.handleStatusMessage)
        this.setupBusNamedEventListener(NAME_STATUS, this.handleStatusMessage)
        this.setupBusNamedResponseListener(NAME_SET_PWM, this.handleSetPWMMessage)
        this.setupBusNamedResponseListener(NAME_TOGGLE_GPIO_DEVICE, this.handleToggleGPIODeviceMessage)
    }

    private handleStatusMessage(message: TResponseStatusMessage & TEventStatusMessage) {
        const temperatureSensorNames = this.ctx.config.temperature_sensors
        const temperatureSensorsData = message.payload.temperature_sensors

        temperatureSensorNames?.forEach(name => {
            temperatureSensorsData?.forEach(data => {
                if (data.name === name) {
                    this.ctx.state.updateTemperatureSensorStatus(data as ITemperatureSensorReadResult)
                }
            })
        })

        const lightDeviceNames = this.ctx.config.lights
        const gpioDevicesData = message.payload.gpio_devices

        lightDeviceNames?.forEach(name => {
            gpioDevicesData?.forEach(data => {
                if (data.name === name) {
                    this.ctx.state.updateLightDeviceStatus(data as IGPIODeviceResult)
                }
            })
        })

        const fanDeviceNames = this.ctx.config.fans
        fanDeviceNames?.forEach(name => {
            gpioDevicesData?.forEach(data => {
                if (data.name === name) {
                    this.ctx.state.updataFanDeviceStatus(data as IGPIODeviceResult)
                }
            })
        })

        const heaterDeviceNames = this.ctx.config.heaters
        const pwmDevicesData = message.payload.pwm_devices

        heaterDeviceNames?.forEach(name => {
            pwmDevicesData?.forEach(data => {
                if (data.name === name) {
                    this.ctx.state.updataHeaterDeviceStatus(data as IPWMDeviceResult)
                }
            })
        })

        this.emitState()
    }

    private handleSetPWMMessage(message: TResponseSetPWMMessage) {
        const heaterDeviceNames = this.ctx.config.heaters
        const pwmDevicesData = message.payload.device

        heaterDeviceNames?.forEach(name => {
            if (pwmDevicesData.name === name) {
                this.ctx.state.updataHeaterDeviceStatus(pwmDevicesData as IPWMDeviceResult)
            }
        })

        this.emitState()
    }

    private handleToggleGPIODeviceMessage(message: TResponseToggleGPIODeviceMessage) {
        const lightDeviceNames = this.ctx.config.lights
        const gpioDevicesData = message.payload.device

        lightDeviceNames?.forEach(name => {
            if (gpioDevicesData.name === name) {
                this.ctx.state.updateLightDeviceStatus(gpioDevicesData as IGPIODeviceResult)
            }
        })

        const fanDeviceNames = this.ctx.config.fans
        fanDeviceNames?.forEach(name => {
            if (gpioDevicesData.name === name) {
                this.ctx.state.updataFanDeviceStatus(gpioDevicesData as IGPIODeviceResult)
            }
        })

        this.emitState()
    }

    emitState() {
        const state = this.ctx.state.getCurrentState()
        this.ctx.onStateUpdate(state)

        this.sendMessage(
            createEventHeatingChamberSateMessage({
                name: this.ctx.config.name,
                state,
            }),
        )
    }
}
