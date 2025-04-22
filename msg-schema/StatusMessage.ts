import { z } from 'zod'
import { BaseMessageSchema, createMessage } from './BaseMessage.ts'
import { GPIODeviceSchema, PWMDeviceSchema, TemperatureSensorSchema } from './DeviceStatus.ts'

export const TYPES = {
    RQ_STATUS: 'RQ_STATUS',
    RS_STATUS: 'RS_STATUS',
    EVENT_STATUS: 'EVENT_STATUS',
} as const

export const RqStatusSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_STATUS),
})

export type TRqStatusMessage = z.infer<typeof RqStatusSchema>

export const RsStatusPayloadSchema = z.object({
    temperature_sensors: z.array(TemperatureSensorSchema).optional().describe('Array of temperature sensors'),
    gpio_devices: z.array(GPIODeviceSchema).optional().describe('Array of gpio device'),
    pwm_devices: z.array(PWMDeviceSchema).optional().describe('Array of gpio device'),
})

export type TRsStatusMessagePayload = z.infer<typeof RsStatusPayloadSchema>

export const RsStatusSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RS_STATUS),
    payload: RsStatusPayloadSchema,
})

export type TRsStatusMessage = z.infer<typeof RsStatusSchema>

export const EventStatusSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.EVENT_STATUS),
    payload: RsStatusPayloadSchema,
})

export type TEventStatusMessage = z.infer<typeof EventStatusSchema>

export function createRqStatusMessage(): TRqStatusMessage {
    return createMessage(RqStatusSchema, TYPES.RQ_STATUS)
}

export function createRsStatusMessage(payload: TRsStatusMessagePayload): TRsStatusMessage {
    return createMessage(RsStatusSchema, TYPES.RS_STATUS, payload)
}

export function createEventStatusMessage(payload: TRsStatusMessagePayload): TEventStatusMessage {
    return createMessage(EventStatusSchema, TYPES.EVENT_STATUS, payload)
}
