import { z } from 'zod'
import { Message } from './BaseMessage.ts'

export const NAME_PONG = 'PONG' as const

export const pongMessagePayloadSchema = Message.responseMessagePayloadSchema.extend({})

export const pongMessageSchema = Message.responseMessageSchema.extend({
    payload: pongMessagePayloadSchema,
})

export type TPongMessagePayload = z.infer<typeof pongMessagePayloadSchema>
export type TPongMessage = z.infer<typeof pongMessageSchema>

export function createPongMessage(requestUID: Message.TUid): TPongMessage {
    return Message.createResponseMessage<TPongMessage>(requestUID, NAME_PONG, pongMessageSchema)
}
