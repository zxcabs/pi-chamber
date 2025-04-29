import { createRequestMessage as createRequestSerGPIODevicesValueMessage } from '../../../msg-schema/SetGPIODevicesValueMessage.ts'
import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'
import type MessageBus from '../../../msg-bus/MessageBus.ts'
import { createRequestToggleGPIOMessage } from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import type { TGPIOValue } from '../devices/types/IGPIODevice.type.ts'
import type { IHeatingChamberResult } from './HeatingChamber.type.ts'
import HeatingChamberBridge from './HeatingChamberBridge.ts'
import HeatingChamberState, { type THeatingChamberCurrentState } from './HeatingChamberState.ts'

export default class HeatingChamber {
    readonly state: HeatingChamberState
    private ebusBridge: HeatingChamberBridge

    constructor(
        readonly config: THeatingChamberConfig,
        ebus: MessageBus,
    ) {
        this.state = new HeatingChamberState()
        this.ebusBridge = new HeatingChamberBridge(this, ebus)
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

    async connect(): Promise<void> {}
    async release(): Promise<void> {
        await this.ebusBridge.release()
    }

    async read(): Promise<IHeatingChamberResult> {
        return {
            config: this.config,
            state: this.state.getCurrentState(),
        }
    }
}
