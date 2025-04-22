import { z } from 'zod'
import { BaseMessageSchema, createMessage } from './BaseMessage.ts'
import { DeviceNameSchema, DeviceValueSchema, GPIODeviceSchema, PWMDeviceSchema } from './DeviceStatus.ts'

export const TYPES = {
    RQ_SET_PWM: 'RQ_SET_PWM',
    RS_SET_PWM: 'RS_SET_PWM',
} as const

export const RqSetPWMMessagePayloadSchema = z.object({
    name: DeviceNameSchema,
    value: DeviceValueSchema,
})

export type TRqSetPWMPayloadMessage = z.infer<typeof RqSetPWMMessagePayloadSchema>

export const RqSetPWMMessageSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_SET_PWM),
    payload: RqSetPWMMessagePayloadSchema,
})

export type TRqSetPWMMessage = z.infer<typeof RqSetPWMMessageSchema>

export const RsSetPWMMessagePayloadSchema = PWMDeviceSchema

export type TRsSetPWMMessagePayload = z.infer<typeof RsSetPWMMessagePayloadSchema>

export const RsSetPWMMessageSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RS_SET_PWM),
    payload: RsSetPWMMessagePayloadSchema,
})

export type TRsSetPWMMessage = z.infer<typeof RsSetPWMMessageSchema>

export function createRqSetPWMMessage(payload: TRqSetPWMPayloadMessage): TRqSetPWMMessage {
    return createMessage(RqSetPWMMessageSchema, TYPES.RQ_SET_PWM, payload)
}

export function createRsSetPWMMessage(payload: TRsSetPWMMessagePayload): TRsSetPWMMessage {
    return createMessage(RsSetPWMMessageSchema, TYPES.RS_SET_PWM, payload)
}
