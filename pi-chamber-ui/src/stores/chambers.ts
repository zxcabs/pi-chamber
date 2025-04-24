import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { IHeatingChamberResult } from '../../../pi-chamber-gpio/src/HeatingChamber/HeatingChamber.type'
import type { TBaseMessage } from '../../../msg-schema/BaseMessage'
import { TYPES, type TRsHeatingChambersMessage } from '../../../msg-schema/HeatingChamberMessage'
import createStoreMessageHandler from '../utils/createStoreMessageHandler'

export type TChamber = IHeatingChamberResult
export type TStoreChambers = Writable<TChamber[]>

export const chambers: TStoreChambers = writable([])

const handleHeatingChamber = createStoreMessageHandler<TRsHeatingChambersMessage>(
    TYPES.RS_HEATING_CHAMBERS,
    message => {
        chambers.set([...message.payload.heating_chambers])
    },
)

export const handleMessage = (message: TBaseMessage) => {
    handleHeatingChamber(message)
}
