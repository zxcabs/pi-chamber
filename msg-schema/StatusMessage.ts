import { z } from 'zod'
import { BaseMessageSchema, createMessage } from './BaseMessage.ts'

export const TYPES = {
    RQ_STATUS: 'RQ_STATUS',
    RS_STATUS: 'RS_STATUS',
} as const

export const RqStatusSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_STATUS),
})

export type TRQStatusMessage = z.infer<typeof RqStatusSchema>

export const RsStatusPayloadSchema = z.object({
    temperature_sensors: z
        .array(
            z.object({
                name: z.string(),
                value: z.number(),
                error: z.string().nullable().optional(),
            }),
        )
        .optional(),
})

export type TRsStatusMessagePayload = z.infer<typeof RsStatusPayloadSchema>

export const RsStatusSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RS_STATUS),
}).merge(RsStatusPayloadSchema)

export type TRSStatusMessage = z.infer<typeof RsStatusSchema>

export function createRqStatusMessage(): TRQStatusMessage {
    return createMessage(RqStatusSchema, TYPES.RQ_STATUS)
}

export function createRsStatusMessage(payload: TRsStatusMessagePayload): TRSStatusMessage {
    return createMessage(RsStatusSchema, TYPES.RS_STATUS, payload)
}
