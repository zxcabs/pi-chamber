import { z } from 'zod'
import { BaseMessageSchema, createMessage } from './BaseMessage.ts'
import { GPIODeviceSchema, TemperatureSensorSchema } from './DeviceStatus.ts'

export const TYPES = {
    RQ_STATUS: 'RQ_STATUS',
    RS_STATUS: 'RS_STATUS',
} as const

export const RqStatusSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RQ_STATUS),
})

export type TRqStatusMessage = z.infer<typeof RqStatusSchema>

export const RsStatusPayloadSchema = z.object({
    temperature_sensors: z.array(TemperatureSensorSchema).optional().describe('Array of temperature sensors'),
    gpio_devices: z.array(GPIODeviceSchema).optional().describe('Array of gpio device'),
})

export type TRsStatusMessagePayload = z.infer<typeof RsStatusPayloadSchema>

export const RsStatusSchema = BaseMessageSchema.extend({
    type: z.literal(TYPES.RS_STATUS),
    payload: RsStatusPayloadSchema,
})

export type TRSStatusMessage = z.infer<typeof RsStatusSchema>

export function createRqStatusMessage(): TRqStatusMessage {
    return createMessage(RqStatusSchema, TYPES.RQ_STATUS)
}

export function createRsStatusMessage(payload: TRsStatusMessagePayload): TRSStatusMessage {
    return createMessage(RsStatusSchema, TYPES.RS_STATUS, payload)
}
