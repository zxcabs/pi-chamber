import { z } from 'zod'
import { Message } from './BaseMessage.ts'

export const NAME = 'NAME_START_SHEDULER_TASK' as const

// Request
export const requestPayloadSchema = Message.payoadSchema.extend({})
export const requestMessageSchema = Message.requestMessageSchema.extend({
    payload: requestPayloadSchema,
})

// Response
export const responsePayloadSchema = Message.responseMessagePayloadSchema.extend({})
export const responseMessageSchema = Message.responseMessageSchema.extend({
    payload: responsePayloadSchema,
})

// Error
export const errorPayloadSchema = Message.errorMessagePayloadSchema.extend({})
export const errorMessageSchema = Message.errorMessageSchema.extend({
    payload: errorPayloadSchema,
})

export type TRequestPayload = z.infer<typeof requestPayloadSchema>
export type TRequestMessage = z.infer<typeof requestMessageSchema>

export type TResponsePayload = z.infer<typeof responsePayloadSchema>
export type TResponseMessage = z.infer<typeof responseMessageSchema>

export type TErrorPayload = z.infer<typeof errorPayloadSchema>
export type TErrorMessage = z.infer<typeof errorMessageSchema>

export function createRequestMessage(payload: TRequestPayload): TRequestMessage {
    return Message.createRequestMessage<TRequestMessage>(NAME, requestMessageSchema, payload)
}

export function createResponseMessage(uid: Message.TUid, payload: TResponsePayload): TResponseMessage {
    return Message.createResponseMessage<TResponseMessage>(uid, NAME, responseMessageSchema, payload)
}

export function createErrorMessage(uid: Message.TUid, payload: TErrorPayload): TErrorMessage {
    return Message.createErrorMessage<TErrorMessage>(uid, NAME, errorMessageSchema, payload)
}
