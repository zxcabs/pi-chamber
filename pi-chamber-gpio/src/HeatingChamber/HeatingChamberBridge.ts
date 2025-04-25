import type { TRsSetPWMMessage } from '../../../msg-schema/PWMDeviceMessage.ts'
import { TYPES as STATUS_TYPES, type TRsStatusMessage } from '../../../msg-schema/StatusMessage.ts'
import { TYPES as PWM_TYPES } from '../../../msg-schema/PWMDeviceMessage.ts'
import { TYPES as TOGGLE_TYPES } from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import type { IGPIODeviceResult } from '../devices/types/IGPIODevice.type.ts'
import type { IPWMDeviceResult } from '../devices/types/IPWMDevice.type.ts'
import type { ITemperatureSensorReadResult } from '../devices/types/ITemperatureSensor.type.ts'
import type EventBus from '../EventBus/EventBus.ts'
import EventBusBridge from '../EventBus/EventBusBridge.ts'
import type HeatingChamber from './HeatingChamber.ts'
import type { TRsToggleGPIODeviceMessage } from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import { createEventHeatingChamberSateMessage } from '../../../msg-schema/HeatingChamberMessage.ts'

export default class HeatingChamberBridge extends EventBusBridge {
    constructor(
        private ctx: HeatingChamber,
        ebus: EventBus,
    ) {
        super(ebus)

        this.setupEBusListener(STATUS_TYPES.RS_STATUS, this.handleStatusMessage)
        this.setupEBusListener(STATUS_TYPES.EVENT_STATUS, this.handleStatusMessage)
        this.setupEBusListener(PWM_TYPES.RS_SET_PWM, this.handleSetPWMMessage)
        this.setupEBusListener(TOGGLE_TYPES.RS_TOGGLE_GPIO_DEVICE, this.handleToggleGPIODeviceMessage)
    }

    private handleStatusMessage(message: TRsStatusMessage) {
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

    private handleSetPWMMessage(message: TRsSetPWMMessage) {
        const heaterDeviceNames = this.ctx.config.heaters
        const pwmDevicesData = message.payload

        heaterDeviceNames?.forEach(name => {
            if (pwmDevicesData.name === name) {
                this.ctx.state.updataHeaterDeviceStatus(pwmDevicesData as IPWMDeviceResult)
            }
        })

        this.emitState()
    }

    private handleToggleGPIODeviceMessage(message: TRsToggleGPIODeviceMessage) {
        const lightDeviceNames = this.ctx.config.lights
        const gpioDevicesData = message.payload

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

        this.eventBus.emit(
            createEventHeatingChamberSateMessage({
                name: this.ctx.config.name,
                state,
            }),
        )
    }
}
