import { createRequestMessage as createRequestSerGPIODevicesValueMessage } from '../../../msg-schema/SetGPIODevicesValueMessage.ts'
import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'
import type MessageBus from '../../../msg-bus/MessageBus.ts'
import { createRequestToggleGPIOMessage } from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import type { TGPIOValue } from '../devices/types/IGPIODevice.type.ts'
import type { IHeatingChamberResult } from './HeatingChamber.type.ts'
import HeatingChamberBridge from './HeatingChamberBridge.ts'
import HeatingChamberState, { type THeatingChamberCurrentState } from './HeatingChamberState.ts'
import HeatingChamberSheduler from './HeatingChamberSheduler.ts'
import type { TPWMValue } from '../devices/types/IPWMDevice.type.ts'
import { createRequestMessage as createRequestSetPWMsMessage } from '../../../msg-schema/SetPWMDevicesValueMessage.ts'
import safeAsync from '../../../utils/safeAsync.ts'
import wait from '../../../utils/wait.ts'

export default class HeatingChamber {
    readonly state: HeatingChamberState
    readonly sheduler: HeatingChamberSheduler
    private ebusBridge: HeatingChamberBridge
    private abortCtrl: AbortController = new AbortController()

    constructor(
        readonly config: THeatingChamberConfig,
        ebus: MessageBus,
    ) {
        this.state = new HeatingChamberState()
        this.ebusBridge = new HeatingChamberBridge(this, ebus)
        this.sheduler = new HeatingChamberSheduler(this)
    }

    get name() {
        return this.config.name
    }

    onStateUpdate(state: THeatingChamberCurrentState) {
        // TODO: For example
        if (state.heaterValue > 0 && state.fan_status === 'OFF') {
            this.ebusBridge.sendMessage(
                createRequestToggleGPIOMessage({
                    name: this.config.fans[0],
                }),
            )
        }
    }

    setLightValue(value: TGPIOValue) {
        const devicesValue = this.config.lights?.map(name => ({
            name,
            value,
        }))

        if (devicesValue?.length) {
            this.ebusBridge.sendMessage(
                createRequestSerGPIODevicesValueMessage({
                    devices: devicesValue,
                }),
            )
        }
    }

    setFanValue(value: TGPIOValue) {
        const devicesValue = this.config.fans?.map(name => ({
            name,
            value,
        }))

        if (devicesValue?.length) {
            this.ebusBridge.sendMessage(
                createRequestSerGPIODevicesValueMessage({
                    devices: devicesValue,
                }),
            )
        }
    }

    setHeaterValue(value: TPWMValue) {
        const devicesValue = this.config.heaters?.map(name => ({
            name,
            value,
        }))

        if (devicesValue?.length) {
            this.ebusBridge.sendMessage(
                createRequestSetPWMsMessage({
                    devices: devicesValue,
                }),
            )
        }
    }

    setTemperature(targetTemperature: number) {
        this.state.targetTemperature = targetTemperature
    }

    private async execute() {
        if (this.abortCtrl.signal.aborted) return

        if (this.state.currentTemperature < this.state.targetTemperature) {
            this.setHeaterValue(100)
        } else {
            this.setHeaterValue(0)
        }

        if (this.state.currentTemperature > this.config.activate_fans_temperature || this.sheduler.running) {
            if (this.state.fanStatus === 'OFF') this.setFanValue(1)
        }

        const result = await safeAsync(wait(1000, this.abortCtrl.signal))

        if (result.success) {
            this.execute()
        }
    }

    async connect(): Promise<void> {
        this.execute()
    }
    async release(): Promise<void> {
        this.abortCtrl.abort()
        await this.sheduler.release()
        await this.ebusBridge.release()
    }

    async read(): Promise<IHeatingChamberResult> {
        return {
            config: this.config,
            state: this.state.getCurrentState(),
        }
    }
}
