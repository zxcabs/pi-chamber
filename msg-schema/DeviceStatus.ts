import { z } from 'zod'

export const DeviceTypeSchema = z.string().min(1).describe('Device type should not be empty')
export const DeviceNameSchema = z.string().min(1).describe('Device name should not be empty')
export const DeviceValueSchema = z.number().finite().describe('Device value should be a finite number')
export const DeviceErrorSchema = z.string().nullable().optional().describe('Error message if device failed')

export const BaseDeviceSchema = z
    .object({
        type: DeviceTypeSchema,
        name: DeviceNameSchema,
        value: DeviceValueSchema,
        error: DeviceErrorSchema,
    })
    .strict()

export const TemperatureSensorSchema = BaseDeviceSchema.extend({}).describe('Temperature sensor data')
export const GPIODeviceSchema = BaseDeviceSchema.extend({}).describe('GPIO device data')

export type TBaseDevice = z.infer<typeof BaseDeviceSchema>
export type TTemperatureSensorData = z.infer<typeof TemperatureSensorSchema>
export type TGPIODeviceData = z.infer<typeof GPIODeviceSchema>
