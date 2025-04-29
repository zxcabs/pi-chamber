import { z } from 'zod'
import { deviceNameSchema, deviceValueSchema, nameSchema } from './schemas/HeatingChamberState.ts'
import { Message } from './BaseMessage.ts'

export const NAME = 'SET_HEATING_CHAMBER_DEVICES_VALUE' as const

export const requestDeviceSchema = z.object({
    chamber: nameSchema,
    name: deviceNameSchema,
    value: deviceValueSchema,
})

export const requestPayloadMessageSchema = Message.payoadSchema.extend({
    devices: requestDeviceSchema.array(),
})

export const requestMessageSchema = Message.requestMessageSchema.extend({
    payload: requestPayloadMessageSchema,
})

export type TRequestDevice = z.infer<typeof requestDeviceSchema>
export type TRequestPayload = z.infer<typeof requestPayloadMessageSchema>
export type TRequestMessage = z.infer<typeof requestMessageSchema>

export function createRequestMessage(payload: TRequestPayload): TRequestMessage {
    return Message.createRequestMessage(NAME, requestMessageSchema, payload)
}
