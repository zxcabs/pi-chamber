import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'
import type EventBus from '../EventBus.ts'
import type { IHeatingChamberResult } from './HeatingChamber.type.ts'

export default class HeatingChamber {
    constructor(
        private config: THeatingChamberConfig,
        private ebus: EventBus,
    ) {}

    async connect(): Promise<void> {}
    async release(): Promise<void> {}

    async read(): Promise<IHeatingChamberResult> {
        return {
            config: this.config,
        }
    }
}
