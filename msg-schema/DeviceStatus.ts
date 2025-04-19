import { z } from 'zod'

const DeviceTypeSchema = z.string().min(1).describe('Device type should not be empty')
const DeviceNameSchema = z.string().min(1).describe('Device name should not be empty')
const DeviceValueSchema = z.number().finite().describe('Device value should be a finite number')
const DeviceErrorSchema = z.string().nullable().optional().describe('Error message if device failed')

export const BaseDeviceSchema = z
    .object({
        type: DeviceTypeSchema,
        name: DeviceNameSchema,
        value: DeviceValueSchema,
        error: DeviceErrorSchema,
    })
    .strict()

export const TemperatureSensorSchema = BaseDeviceSchema.extend({}).describe('Temperature sensor data')
export const LightSchema = BaseDeviceSchema.extend({}).describe('Light device data')

export type TBaseDevice = z.infer<typeof BaseDeviceSchema>
export type TTemperatureSensorData = z.infer<typeof TemperatureSensorSchema>
export type TLightData = z.infer<typeof LightSchema>
