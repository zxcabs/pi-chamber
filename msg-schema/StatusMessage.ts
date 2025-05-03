import { z } from 'zod'
import { Message } from './BaseMessage.ts'
import { GPIODeviceSchema, PWMDeviceSchema, TemperatureSensorSchema } from './schemas/Device.ts'

export const NAME_STATUS = 'STATUS' as const

export const requestStatusMessageSchema = Message.requestMessageSchema.extend({})

export type TRequestStatusMessage = z.infer<typeof requestStatusMessageSchema>

export const responseStatusPayloadSchema = Message.responseMessagePayloadSchema.extend({
    temperature_sensors: z.array(TemperatureSensorSchema).optional().describe('Array of temperature sensors'),
    gpio_devices: z.array(GPIODeviceSchema).optional().describe('Array of gpio device'),
    pwm_devices: z.array(PWMDeviceSchema).optional().describe('Array of gpio device'),
})

export type TResponseStatusMessagePayload = z.infer<typeof responseStatusPayloadSchema>

export const responseStatusMessageSchema = Message.responseMessageSchema.extend({
    payload: responseStatusPayloadSchema,
})

export type TResponseStatusMessage = z.infer<typeof responseStatusMessageSchema>

export const eventStatusMessageSchema = Message.eventMessageSchema.extend({
    payload: responseStatusPayloadSchema,
})

export type TEventStatusMessage = z.infer<typeof eventStatusMessageSchema>

export function createRequestStatusMessage(): TRequestStatusMessage {
    return Message.createRequestMessage(NAME_STATUS, requestStatusMessageSchema)
}

export function createResponseStatusMessage(
    uid: Message.TUid,
    payload: TResponseStatusMessagePayload,
): TResponseStatusMessage {
    return Message.createResponseMessage(uid, NAME_STATUS, responseStatusMessageSchema, payload)
}

export function createEventStatusMessage(payload: TResponseStatusMessagePayload): TEventStatusMessage {
    return Message.createEventMessage(NAME_STATUS, eventStatusMessageSchema, payload)
}
