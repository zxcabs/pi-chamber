import { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { BaseMessageSchema, createMessage, createResponceMessage, type TBaseMessageUUID } from './BaseMessage.ts'
import { heatingChamberSchema } from '../config-reader/schemas/heatingChambers.ts'

export const TYPES = {
    RQ_HEATING_CHAMBERS: 'RQ_HEATING_CHAMBERS',
    RS_HEATING_CHAMBERS: 'RS_HEATING_CHAMBERS',
} as const

export const RqHeatingChambersSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_HEATING_CHAMBERS),
})

export type TRqHeatingChambersMessage = ReadonlyDeep<z.infer<typeof RqHeatingChambersSchema>>

export const RsHeatingChamberSchema = z.object({
    config: heatingChamberSchema,
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

export function createRqHeatingChambersMessage(): TRqHeatingChambersMessage {
    return createMessage(RqHeatingChambersSchema, TYPES.RQ_HEATING_CHAMBERS)
}

export function createRsHeatingChambersMessage(
    payload: TRsHeatingChambersPayload,
    uid: TBaseMessageUUID,
): TRsHeatingChambersMessage {
    return createResponceMessage(RsHeatingChambersSchema, TYPES.RS_HEATING_CHAMBERS, uid, payload)
}
