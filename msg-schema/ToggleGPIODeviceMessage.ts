import { z } from 'zod'
import { Message } from './BaseMessage.ts'
import { DeviceNameSchema, GPIODeviceSchema } from './schemas/Device.ts'

export const NAME_TOGGLE_GPIO_DEVICE = 'TOGGLE_GPIO_DEVICE' as const

export const requestToggleGPIODevicePayloadSchema = Message.payoadSchema.extend({
    name: DeviceNameSchema,
})

export type TRequestToggleGPIODevicePayload = z.infer<typeof requestToggleGPIODevicePayloadSchema>

export const requestToggleGPIODeviceMessageSchema = Message.requestMessageSchema.extend({
    payload: requestToggleGPIODevicePayloadSchema,
})

export type TRequestToggleGPIODeviceMessage = z.infer<typeof requestToggleGPIODeviceMessageSchema>

export const responseToggleGPIODevicePayloadSchema = Message.responseMessagePayloadSchema.extend({
    device: GPIODeviceSchema,
})

export type TResponseToggleGPIODevicePayload = z.infer<typeof responseToggleGPIODevicePayloadSchema>

export const responseToggleGPIODeviceMessageSchema = Message.responseMessageSchema.extend({
    payload: responseToggleGPIODevicePayloadSchema,
})

export type TResponseToggleGPIODeviceMessage = z.infer<typeof responseToggleGPIODeviceMessageSchema>

export function createRequestToggleGPIOMessage(
    payload: TRequestToggleGPIODevicePayload,
): TRequestToggleGPIODeviceMessage {
    return Message.createRequestMessage(NAME_TOGGLE_GPIO_DEVICE, requestToggleGPIODeviceMessageSchema, payload)
}

export function createResponseToggleGPIOMessage(
    uid: Message.TUid,
    payload: TResponseToggleGPIODevicePayload,
): TResponseToggleGPIODeviceMessage {
    return Message.createResponseMessage(uid, NAME_TOGGLE_GPIO_DEVICE, responseToggleGPIODeviceMessageSchema, payload)
}
