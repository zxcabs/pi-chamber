import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'
import type EventBus from '../EventBus/EventBus.ts'
import type { IHeatingChamberResult } from './HeatingChamber.type.ts'
import HeatingChamberBridge from './HeatingChamberBridge.ts'
import HeatingChamberState from './HeatingChamberState.ts'

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
