import { writable, type Writable } from 'svelte/store'
import type { IStoreUpdateDeviceByName } from './store'
import type { IHeatingChamberResult } from '../../../pi-chamber-gpio/src/HeatingChamber/HeatingChamber.type'
import type { TEventHeatingChamberStatePayload } from '../../../msg-schema/HeatingChamberMessage'
import createChartStore, { type TChartItem, type TChartStore } from './chart'

export type TChamberChartItem = TChartItem & {
    current_temperature: number
    target_temperature: number
    heaterValue: number
}

export type TChamberChartStore = TChartStore<TChamberChartItem>
export type TChamber = IHeatingChamberResult
export type TChamberState = TEventHeatingChamberStatePayload
export type TChamberStore = IStoreUpdateDeviceByName<TChamberState> &
    Writable<TChamber> & {
        chart: TChamberChartStore
    }

export default function createStore(initialValue?: TChamber): TChamberStore {
    const store = writable<TChamber>(initialValue)
    const chart = createChartStore<TChamberChartItem>()

    const updateByName = (newChamberState: TChamberState) => {
        store.update(chamber => {
            if (
                chamber.config.name === newChamberState.name &&
                chamber.state.updateAt < newChamberState.state.updateAt
            ) {
                chart.add({
                    time: newChamberState.state.updateAt,
                    current_temperature: newChamberState.state.current_temperature,
                    target_temperature: newChamberState.state.target_temperature,
                    heaterValue: newChamberState.state.heaterValue,
                })

                return {
                    ...chamber,
                    state: {
                        ...chamber.state,
                        ...newChamberState.state,
                    },
                }
            }

            return chamber
        })
    }

    return {
        ...store,
        chart,
        updateByName,
    }
}
