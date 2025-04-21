import { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { BaseMessageSchema, createMessage } from './BaseMessage.ts'

export const TYPES = {
    RQ_SHUTDOWN: 'RQ_SHUTDOWN',
} as const

export const RqShutdownSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_SHUTDOWN),
})

export type TRqShutdownMessage = ReadonlyDeep<z.infer<typeof RqShutdownSchema>>

export function createRqShutdownMessage(): TRqShutdownMessage {
    return createMessage(RqShutdownSchema, TYPES.RQ_SHUTDOWN)
}
