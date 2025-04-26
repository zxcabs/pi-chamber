import { z } from 'zod'
import { Message } from './BaseMessage.ts'

export const NAME_PING = 'PING' as const

export const pingMessageSchema = Message.requestMessageSchema.extend({})

export type TPingMessage = z.infer<typeof pingMessageSchema>

export function createPingMessage(): TPingMessage {
    return Message.createRequestMessage<TPingMessage>(NAME_PING, pingMessageSchema)
}
