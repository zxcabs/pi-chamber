import { z } from 'zod'
import { gpioDeviceSchema } from './gpioDevices.ts'

export const pwmDeviceSchema = gpioDeviceSchema
    .extend({
        frequency: z.number({ invalid_type_error: 'PWM frequency must be a number' }).min(0).max(100).default(0.5),
        initial_value: z
            .number({ invalid_type_error: 'PWM initial_value must be a number' })
            .min(0)
            .max(100)
            .default(0),
    })
    .strict()

export const pwmDevicesSchema = z
    .array(pwmDeviceSchema)
    .refine(items => new Set(items.map(i => i.name)).size === items.length, {
        message: 'PWM device name must be unique',
    })
