import { writable, type Writable } from 'svelte/store'
import { Message } from '../../../msg-schema/BaseMessage'
import {
    NAME_HEATING_CHAMBERS,
    type TEventHeatingChamberState,
    type TResponseHeatingChambersMessage,
} from '../../../msg-schema/HeatingChamberMessage'
import createStoreMessageHandler from '../utils/createStoreMessageHandler'
import type { IStoreWithMessageHandler, TMessageHandler } from './store'
import createHeatingChamberStore, { type TChamberStore } from './chamber'

export type TChambersStore = IStoreWithMessageHandler & Writable<TChamberStore[]> & {}

export default function createStore(): TChambersStore {
    const store = writable<TChamberStore[]>([])

    const handlers: TMessageHandler[] = [
        createStoreMessageHandler<TResponseHeatingChambersMessage>(
            `${Message.TYPE_RESPONSE}:${NAME_HEATING_CHAMBERS}`,
            message => {
                store.update(current => {
                    const newChambers = message.payload.heating_chambers?.filter(
                        chamber => !current?.find(currentChamber => currentChamber.name === chamber.config.name),
                    )

                    if (newChambers?.length === 0) return current

                    return current.concat(newChambers.map(chamber => createHeatingChamberStore(chamber)))
                })
            },
        ),

        createStoreMessageHandler<TEventHeatingChamberState>(
            `${Message.TYPE_EVENT}:${NAME_HEATING_CHAMBERS}`,
            message => {
                store.update(chambers =>
                    chambers.map(chamberStore => {
                        chamberStore.updateByName(message.payload)
                        return chamberStore
                    }),
                )
            },
        ),
    ]

    const handleMessage: TMessageHandler = message => {
        handlers.forEach(handler => handler(message))
    }

    return {
        ...store,
        handleMessage,
    }
}
