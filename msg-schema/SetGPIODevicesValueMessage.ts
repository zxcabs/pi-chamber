import { z } from 'zod'
import { DeviceNameSchema, GPIODeviceSchema, GPIODeviceValueSchema } from './schemas/Device.ts'
import { Message } from './BaseMessage.ts'

export const NAME = 'NAME_SET_GPIO_DEVICES_VALUE' as const

export const requestDeviceSchema = z.object({
    name: DeviceNameSchema,
    value: GPIODeviceValueSchema,
})

export const requestPayloadMessageSchema = Message.payoadSchema.extend({
    devices: requestDeviceSchema.array(),
})

export const requestMessageSchema = Message.requestMessageSchema.extend({
    payload: requestPayloadMessageSchema,
})

export const responsePayloadMessageSchema = Message.responseMessagePayloadSchema.extend({
    devices: GPIODeviceSchema.array(),
})

export const responseMessageSchema = Message.responseMessageSchema.extend({
    payload: responsePayloadMessageSchema,
})

export type TRequestDevice = z.infer<typeof requestDeviceSchema>
export type TRequestPayload = z.infer<typeof requestPayloadMessageSchema>
export type TRequestMessage = z.infer<typeof requestMessageSchema>
export type TResponsePayload = z.infer<typeof responsePayloadMessageSchema>
export type TResponseMessage = z.infer<typeof responseMessageSchema>

export function createRequestMessage(payload: TRequestPayload): TRequestMessage {
    return Message.createRequestMessage(NAME, requestMessageSchema, payload)
}

export function createResponseMessage(uid: Message.TUid, payload: TResponsePayload): TResponseMessage {
    return Message.createResponseMessage(uid, NAME, responseMessageSchema, payload)
}
