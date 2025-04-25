import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'
import { createRqToggleGPIODeviceMessage } from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import type EventBus from '../EventBus/EventBus.ts'
import type { IHeatingChamberResult } from './HeatingChamber.type.ts'
import HeatingChamberBridge from './HeatingChamberBridge.ts'
import HeatingChamberState, { type THeatingChamberCurrentState } from './HeatingChamberState.ts'

export default class HeatingChamber {
    readonly state: HeatingChamberState
    private ebusBridge: HeatingChamberBridge

    constructor(
        readonly config: THeatingChamberConfig,
        ebus: EventBus,
    ) {
        this.state = new HeatingChamberState()
        this.ebusBridge = new HeatingChamberBridge(this, ebus)
    }

    onStateUpdate(state: THeatingChamberCurrentState) {
        // TODO: For example
        if (state.heaterValue > 0 && state.fan_status === 'OFF') {
            this.ebusBridge.sendMessage(
                createRqToggleGPIODeviceMessage({
                    name: this.config.fans[0],
                }),
            )
        } else if (state.heaterValue === 0 && state.fan_status === 'ON') {
            this.ebusBridge.sendMessage(
                createRqToggleGPIODeviceMessage({
                    name: this.config.fans[0],
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
