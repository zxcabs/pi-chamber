import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'
import type MessageBus from '../../../msg-bus/MessageBus.ts'
import { createRequestToggleGPIOMessage } from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
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
