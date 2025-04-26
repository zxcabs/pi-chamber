import { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { Message } from './BaseMessage.ts'
import { heatingChamberSchema, nameSchema } from '../config-reader/schemas/heatingChambers.ts'

export const NAME_HEATING_CHAMBERS = 'HEATING_CHAMBERS' as const

export const requestHeatingChambersSchema = Message.requestMessageSchema.extend({})

export type TRequestHeatingChambersMessage = z.infer<typeof requestHeatingChambersSchema>

export const heatingChamberStateSchema = z
    .object({
        updateAt: z.number(),
        status: z.enum(['ON', 'OFF', 'ERROR']),
        heaterValue: z.number(),
        fan_status: z.enum(['ON', 'OFF', 'ERROR']),
        light_status: z.enum(['ON', 'OFF', 'ERROR']),
        current_temperature: z.number(),
        target_temperature: z.number(),
    })
    .describe('Heating chamber state')

export const responseHeatingChamberSchema = z.object({
    config: heatingChamberSchema,
    state: heatingChamberStateSchema,
})

export type TResponseHeatingChamber = z.infer<typeof responseHeatingChamberSchema>

export const responseHeatingChambersPayloadSchema = Message.responseMessagePayloadSchema.extend({
    heating_chambers: z.array(responseHeatingChamberSchema),
})

export type TResponseHeatingChambersPayload = ReadonlyDeep<z.infer<typeof responseHeatingChambersPayloadSchema>>

export const ResponseHeatingChambersSchema = Message.responseMessageSchema.extend({
    payload: responseHeatingChambersPayloadSchema,
})

export type TResponseHeatingChambersMessage = ReadonlyDeep<z.infer<typeof ResponseHeatingChambersSchema>>

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
    return Message.createResponseMessage(uid, NAME_HEATING_CHAMBERS, ResponseHeatingChambersSchema, payload)
}

export function createEventHeatingChamberSateMessage(
    payload: TEventHeatingChamberStatePayload,
): TEventHeatingChamberState {
    return Message.createEventMessage(NAME_HEATING_CHAMBERS, eventHeatingChamberStateSchema, payload)
}
