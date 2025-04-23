import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'

export default class HeatingChamber {
    constructor(private config: THeatingChamberConfig) {}

    async connect(): Promise<void> {}
    async release(): Promise<void> {}
}
