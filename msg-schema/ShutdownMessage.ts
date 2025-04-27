import { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { Message } from './BaseMessage.ts'

export const NAME_SHUTDOWN = 'SHUTDOWN' as const

export const requestShutdownMessageSchema = Message.requestMessageSchema.extend({})

export type TRequestShutdownMessage = ReadonlyDeep<z.infer<typeof requestShutdownMessageSchema>>

export function createRequestShutdownMessage(): TRequestShutdownMessage {
    return Message.createRequestMessage(NAME_SHUTDOWN, requestShutdownMessageSchema)
}
