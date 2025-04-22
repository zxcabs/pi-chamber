import { z } from 'zod'

// Base device message fields
export const DeviceTypeSchema = z.string().min(1).describe('Device type should not be empty')
export const DeviceNameSchema = z.string().min(1).describe('Device name should not be empty')
export const DeviceTimeSchema = z.number().min(0).finite().describe('Device get status time')
export const DeviceValueSchema = z.number().finite().describe('Device value should be a finite number')
export const DeviceErrorSchema = z.string().nullable().optional().describe('Error message if device failed')

export const BaseDeviceSchema = z
    .object({
        type: DeviceTypeSchema,
        name: DeviceNameSchema,
        time: DeviceTimeSchema,
        value: DeviceValueSchema,
        error: DeviceErrorSchema,
    })
    .strict()

export type TBaseDevice = z.infer<typeof BaseDeviceSchema>

// GPIO device message fields
export const GPIODeviceSchema = BaseDeviceSchema.extend({}).describe('GPIO device data')

export type TGPIODeviceData = z.infer<typeof GPIODeviceSchema>

// PWM device message fields
export const PWMDeviceSchema = BaseDeviceSchema.extend({}).describe('PWM device data')

export type TPWMDeviceData = z.infer<typeof GPIODeviceSchema>

// Temperature sensors message field
export const TemperatureSensorSchema = BaseDeviceSchema.extend({}).describe('Temperature sensor data')

export type TTemperatureSensorData = z.infer<typeof TemperatureSensorSchema>

// Heaters sesors message field
//export const HeaterSchema = BaseDeviceSchema.extend({}).describe('Heater data')
//export type THeaterData = z.infer<typeof HeaterSchema>
