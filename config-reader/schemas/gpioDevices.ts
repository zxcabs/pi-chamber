import { z } from 'zod'

export const nameSchema = z.string({
    required_error: 'GPIO device name is required',
})

export const gpioSchema = z
    .number({
        required_error: 'GPIO device number is required',
        invalid_type_error: 'GPIO device must be a number',
    })
    .min(0)
    .max(40)

export const initialValueSchema = z
    .number({ invalid_type_error: 'GPIO device must be a number' })
    .min(0)
    .max(1)
    .default(0)

export const gpioDeviceSchema = z
    .object({
        name: nameSchema,
        gpio: gpioSchema,
        initial_value: initialValueSchema,
    })
    .strict()

export const gpioDevicesSchema = z
    .array(gpioDeviceSchema)
    .refine(items => new Set(items.map(i => i.name)).size === items.length, {
        message: 'GPIO device name must be unique',
    })
