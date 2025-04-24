import { z } from 'zod'
import { BaseMessageSchema, createMessage, createResponceMessage, type TBaseMessageUUID } from './BaseMessage.ts'
import { DeviceNameSchema, GPIODeviceSchema } from './DeviceStatus.ts'

export const TYPES = {
    RQ_TOGGLE_GPIO_DEVICE: 'RQ_TOGGLE_GPIO_DEVICE',
    RS_TOGGLE_GPIO_DEVICE: 'RS_TOGGLE_GPIO_DEVICE',
} as const

export const RqToggleGPIODeviceMessagePayloadSchema = z.object({
    name: DeviceNameSchema,
})

export type TRqToggleGPIODevicePayloadMessage = z.infer<typeof RqToggleGPIODeviceMessagePayloadSchema>

export const RqToggleGPIODeviceMessageSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_TOGGLE_GPIO_DEVICE),
    payload: RqToggleGPIODeviceMessagePayloadSchema,
})

export type TRqToggleGPIODeviceMessage = z.infer<typeof RqToggleGPIODeviceMessageSchema>

export const RsToggleGPIODeviceMessagePayloadSchema = GPIODeviceSchema

export type TRsToggleGPIODeviceMessagePayload = z.infer<typeof RsToggleGPIODeviceMessagePayloadSchema>

export const RsToggleGPIODeviceMessageSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RS_TOGGLE_GPIO_DEVICE),
    payload: RsToggleGPIODeviceMessagePayloadSchema,
})

export type TRsToggleGPIODeviceMessage = z.infer<typeof RsToggleGPIODeviceMessageSchema>

export function createRqToggleGPIODeviceMessage(
    payload: TRqToggleGPIODevicePayloadMessage,
): TRqToggleGPIODeviceMessage {
    return createMessage(RqToggleGPIODeviceMessageSchema, TYPES.RQ_TOGGLE_GPIO_DEVICE, payload)
}

export function createRsToggleGPIODeviceMessage(
    payload: TRsToggleGPIODeviceMessagePayload,
    uid: TBaseMessageUUID,
): TRsToggleGPIODeviceMessage {
    return createResponceMessage(RsToggleGPIODeviceMessageSchema, TYPES.RS_TOGGLE_GPIO_DEVICE, uid, payload)
}
