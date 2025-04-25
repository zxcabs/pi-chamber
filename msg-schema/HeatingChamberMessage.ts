import { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { BaseMessageSchema, createMessage, createResponceMessage, type TBaseMessageUUID } from './BaseMessage.ts'
import { heatingChamberSchema, nameSchema } from '../config-reader/schemas/heatingChambers.ts'

export const TYPES = {
    RQ_HEATING_CHAMBERS: 'RQ_HEATING_CHAMBERS',
    RS_HEATING_CHAMBERS: 'RS_HEATING_CHAMBERS',
    EVENT_HEATING_CHAMBER_STATE: 'EVENT_HEATING_CHAMBER_STATE',
} as const

export const RqHeatingChambersSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_HEATING_CHAMBERS),
})

export type TRqHeatingChambersMessage = ReadonlyDeep<z.infer<typeof RqHeatingChambersSchema>>

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

export const RsHeatingChamberSchema = z.object({
    config: heatingChamberSchema,
    state: heatingChamberStateSchema,
})

export type TRsHeatingChamber = ReadonlyDeep<z.infer<typeof RsHeatingChamberSchema>>

export const RsHeatingChambersPayloadSchema = z.object({
    heating_chambers: z.array(RsHeatingChamberSchema),
})

export type TRsHeatingChambersPayload = ReadonlyDeep<z.infer<typeof RsHeatingChambersPayloadSchema>>

export const RsHeatingChambersSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RS_HEATING_CHAMBERS),
    payload: RsHeatingChambersPayloadSchema,
})

export type TRsHeatingChambersMessage = ReadonlyDeep<z.infer<typeof RsHeatingChambersSchema>>

export const EventHeatingChamberStatePayloadSchema = z.object({
    name: nameSchema,
    state: heatingChamberStateSchema,
})

export type TEventHeatingChamberStatePayload = ReadonlyDeep<z.infer<typeof EventHeatingChamberStatePayloadSchema>>

export const EventHeatingChamberStateSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.EVENT_HEATING_CHAMBER_STATE),
    payload: EventHeatingChamberStatePayloadSchema,
})

export type TEventHeatingChamberState = ReadonlyDeep<z.infer<typeof EventHeatingChamberStateSchema>>

export function createRqHeatingChambersMessage(): TRqHeatingChambersMessage {
    return createMessage(RqHeatingChambersSchema, TYPES.RQ_HEATING_CHAMBERS)
}

export function createRsHeatingChambersMessage(
    payload: TRsHeatingChambersPayload,
    uid: TBaseMessageUUID,
): TRsHeatingChambersMessage {
    return createResponceMessage(RsHeatingChambersSchema, TYPES.RS_HEATING_CHAMBERS, uid, payload)
}

export function createEventHeatingChamberSateMessage(
    payload: TEventHeatingChamberStatePayload,
): TEventHeatingChamberState {
    return createMessage(EventHeatingChamberStateSchema, TYPES.EVENT_HEATING_CHAMBER_STATE, payload)
}
