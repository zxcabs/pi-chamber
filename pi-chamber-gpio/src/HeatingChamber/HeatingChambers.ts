import type { THeatingChambersConfig } from '../../../config-reader/readConfig.types.ts'
import type EventBus from '../EventBus.ts'
import HeatingChamber from './HeatingChamber.ts'

export default class HeatingChambers {
    private chambers: HeatingChamber[]

    constructor(private config: THeatingChambersConfig, ebus: EventBus) {
        this.chambers = this.config.map(heatinChamberConfig => new HeatingChamber(heatinChamberConfig, ebus))
    }

    async connect(): Promise<void> {
        await Promise.all(this.chambers.map(chamber => chamber.connect()))
    }

    async release(): Promise<void> {
        await Promise.all(this.chambers.map(chamber => chamber.release()))
    }
}
