import { z } from 'zod'
import { Message } from './BaseMessage.ts'
import { DeviceNameSchema, DeviceValueSchema, PWMDeviceSchema } from './schemas/Device.ts'

export const NAME_SET_PWM = 'SET_PWM' as const

export const requestSetPWMMessagePayloadSchema = Message.payoadSchema.extend({
    name: DeviceNameSchema,
    value: DeviceValueSchema,
})

export type TRequestSetPWMPayloadMessage = z.infer<typeof requestSetPWMMessagePayloadSchema>

export const requestSetPWMMessageSchema = Message.requestMessageSchema.extend({
    payload: requestSetPWMMessagePayloadSchema,
})

export type TRequestSetPWMMessage = z.infer<typeof requestSetPWMMessageSchema>

export const responseSetPWMMessagePayloadSchema = Message.responseMessagePayloadSchema.extend({
    device: PWMDeviceSchema,
})

export type TResponseSetPWMMessagePayload = z.infer<typeof responseSetPWMMessagePayloadSchema>

export const responseSetPWMMessageSchema = Message.responseMessageSchema.extend({
    payload: responseSetPWMMessagePayloadSchema,
})

export type TResponseSetPWMMessage = z.infer<typeof responseSetPWMMessageSchema>

export function createRequestSetPWMMessage(payload: TRequestSetPWMPayloadMessage): TRequestSetPWMMessage {
    return Message.createRequestMessage(NAME_SET_PWM, requestSetPWMMessageSchema, payload)
}

export function createResponseSetPWMMessage(
    uid: Message.TUid,
    payload: TResponseSetPWMMessagePayload,
): TResponseSetPWMMessage {
    return Message.createResponseMessage(uid, NAME_SET_PWM, responseSetPWMMessageSchema, payload)
}
