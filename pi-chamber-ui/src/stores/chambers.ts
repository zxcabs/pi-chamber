import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { IHeatingChamberResult } from '../../../pi-chamber-gpio/src/HeatingChamber/HeatingChamber.type'
import type { TBaseMessage } from '../../../msg-schema/BaseMessage'
import {
    type TEventHeatingChamberState,
    TYPES,
    type TRsHeatingChambersMessage,
} from '../../../msg-schema/HeatingChamberMessage'
import createStoreMessageHandler from '../utils/createStoreMessageHandler'
import type { THeatingChamberCurrentState } from '../../../pi-chamber-gpio/src/HeatingChamber/HeatingChamberState'

export type TChamber = IHeatingChamberResult
export type TStoreChambers = Writable<TChamber[]>

export const chambers: TStoreChambers = writable([])

const updateChamberState = (name: string, newSate: THeatingChamberCurrentState) => (currentChambers: TChamber[]) => {
    const index = currentChambers.findIndex(d => d.config.name === name)

    if (index !== -1 && currentChambers[index].state.updateAt <= newSate.updateAt) {
        return [
            ...currentChambers.slice(0, index),
            { ...currentChambers[index], state: newSate },
            ...currentChambers.slice(index + 1),
        ]
    }
    return currentChambers
}

const handleSingleChamerStateUpdate = (name: string, newSate: THeatingChamberCurrentState) => {
    chambers.update(updateChamberState(name, newSate))
}

const handlers = [
    createStoreMessageHandler<TRsHeatingChambersMessage>(TYPES.RS_HEATING_CHAMBERS, message => {
        chambers.set([...message.payload.heating_chambers])
    }),

    createStoreMessageHandler<TEventHeatingChamberState>(TYPES.EVENT_HEATING_CHAMBER_STATE, message => {
        handleSingleChamerStateUpdate(message.payload.name, message.payload.state as THeatingChamberCurrentState)
    }),
]

export const handleMessage = (message: TBaseMessage) => {
    handlers.forEach(handler => handler(message))
}
