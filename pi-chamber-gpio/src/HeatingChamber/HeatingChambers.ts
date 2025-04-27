import type { THeatingChambersConfig } from '../../../config-reader/readConfig.types.ts'
import type MessageBus from '../../../msg-bus/MessageBus.ts'
import HeatingChamber from './HeatingChamber.ts'
import type { IHeatingChamberResult } from './HeatingChamber.type.ts'

export default class HeatingChambers {
    private chambers: HeatingChamber[]

    constructor(
        private config: THeatingChambersConfig,
        ebus: MessageBus,
    ) {
        this.chambers = this.config.map(heatinChamberConfig => new HeatingChamber(heatinChamberConfig, ebus))
    }

    async connect(): Promise<void> {
        await Promise.all(this.chambers.map(chamber => chamber.connect()))
    }

    async release(): Promise<void> {
        await Promise.all(this.chambers.map(chamber => chamber.release()))
    }

    async readAll(): Promise<IHeatingChamberResult[]> {
        return await Promise.all(this.chambers.map(chamber => chamber.read()))
    }
}
