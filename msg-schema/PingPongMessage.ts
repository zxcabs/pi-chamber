import { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { BaseMessageSchema, createMessage } from './BaseMessage.ts'

export const TYPES = {
    PING: 'PING',
    PONG: 'PONG',
} as const

export const PingSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.PING),
})

export type TPingMessage = ReadonlyDeep<z.infer<typeof PingSchema>>

export const PongSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.PONG),
})

export type TPongMessage = ReadonlyDeep<z.infer<typeof PongSchema>>

export const PingPongSchema = z.union([PingSchema, PongSchema])
export type TPingPongMessage = ReadonlyDeep<z.infer<typeof PingPongSchema>>

export function createPingMessage(): TPingMessage {
    return createMessage(PingSchema, TYPES.PING)
}

export function createPongMessage(uid: string): TPongMessage {
    const pongMsg = createMessage(PongSchema, TYPES.PONG)
    pongMsg.uid = uid

    return pongMsg
}
