import type { THeatingChambersConfig } from '../../../config-reader/readConfig.types.ts'
import HeatingChamber from './HeatingChamber.ts'

export default class HeatingChambers {
    private chambers: HeatingChamber[]

    constructor(private config: THeatingChambersConfig) {
        this.chambers = this.config.map(heatinChamberConfig => new HeatingChamber(heatinChamberConfig))
    }

    async connect(): Promise<void> {
        await Promise.all(this.chambers.map(chamber => chamber.connect()))
    }

    async release(): Promise<void> {
        await Promise.all(this.chambers.map(chamber => chamber.release()))
    }
}
