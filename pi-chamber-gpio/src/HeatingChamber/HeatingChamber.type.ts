import type { THeatingChamberConfig } from '../../../config-reader/readConfig.types.ts'
import type { THeatingChamberCurrentState } from './HeatingChamberState.ts'

export interface IHeatingChamberResult {
    config: THeatingChamberConfig
    state: THeatingChamberCurrentState
}
