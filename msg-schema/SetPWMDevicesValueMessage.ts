import { z } from 'zod'
import { Message } from './BaseMessage.ts'
import { DeviceNameSchema, DeviceValueSchema, PWMDeviceSchema } from './schemas/Device.ts'

export const NAME = 'SET_PWM_DEVICES_VALUE' as const

const deviceSchema = z.object({
    name: DeviceNameSchema,
    value: DeviceValueSchema,
})

export const requestPayloadSchema = Message.payoadSchema.extend({
    devices: deviceSchema.array().min(1),
})

export const requestMessageSchema = Message.requestMessageSchema.extend({
    payload: requestPayloadSchema,
})

export const responsePayloadSchema = Message.responseMessagePayloadSchema.extend({
    devices: PWMDeviceSchema.array().min(1),
})

export const responseMessageSchema = Message.responseMessageSchema.extend({
    payload: responsePayloadSchema,
})

export type TRequestPayload = z.infer<typeof requestPayloadSchema>
export type TRequestMessage = z.infer<typeof requestMessageSchema>
export type TResponsePayload = z.infer<typeof responsePayloadSchema>
export type TResponseMessage = z.infer<typeof responseMessageSchema>

export function createRequestMessage(payload: TRequestPayload): TRequestMessage {
    return Message.createRequestMessage(NAME, requestMessageSchema, payload)
}

export function createResponseMessage(uid: Message.TUid, payload: TResponsePayload): TResponseMessage {
    return Message.createResponseMessage(uid, NAME, responseMessageSchema, payload)
}
