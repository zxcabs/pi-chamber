import { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { Message } from './BaseMessage.ts'
import {
    heatingChamberSchema as heatingChamberConfigSchema,
    nameSchema,
} from '../config-reader/schemas/heatingChambers.ts'
import { heatingChamberStateSchema } from './schemas/HeatingChamberState.ts'

export const NAME_HEATING_CHAMBERS = 'HEATING_CHAMBERS' as const

export const requestHeatingChambersSchema = Message.requestMessageSchema.extend({})

export type TRequestHeatingChambersMessage = z.infer<typeof requestHeatingChambersSchema>

export const responseHeatingChamberSchema = z.object({
    config: heatingChamberConfigSchema,
    state: heatingChamberStateSchema,
})

export type TResponseHeatingChamber = z.infer<typeof responseHeatingChamberSchema>

export const responseHeatingChambersPayloadSchema = Message.responseMessagePayloadSchema.extend({
    heating_chambers: z.array(responseHeatingChamberSchema),
})

export type TResponseHeatingChambersPayload = ReadonlyDeep<z.infer<typeof responseHeatingChambersPayloadSchema>>

export const responseHeatingChambersSchema = Message.responseMessageSchema.extend({
    payload: responseHeatingChambersPayloadSchema,
})

export type TResponseHeatingChambersMessage = ReadonlyDeep<z.infer<typeof responseHeatingChambersSchema>>

export const eventHeatingChamberStatePayloadSchema = z.object({
    name: nameSchema,
    state: heatingChamberStateSchema,
})

export type TEventHeatingChamberStatePayload = z.infer<typeof eventHeatingChamberStatePayloadSchema>

export const eventHeatingChamberStateSchema = Message.eventMessageSchema.extend({
    payload: eventHeatingChamberStatePayloadSchema,
})

export type TEventHeatingChamberState = ReadonlyDeep<z.infer<typeof eventHeatingChamberStateSchema>>

export function createRequestHeatingChambersMessage(): TRequestHeatingChambersMessage {
    return Message.createRequestMessage(NAME_HEATING_CHAMBERS, requestHeatingChambersSchema)
}

export function createResponseHeatingChambersMessage(
    uid: Message.TUid,
    payload: TResponseHeatingChambersPayload,
): TResponseHeatingChambersMessage {
    return Message.createResponseMessage(uid, NAME_HEATING_CHAMBERS, responseHeatingChambersSchema, payload)
}

export function createEventHeatingChamberSateMessage(
    payload: TEventHeatingChamberStatePayload,
): TEventHeatingChamberState {
    return Message.createEventMessage(NAME_HEATING_CHAMBERS, eventHeatingChamberStateSchema, payload)
}
