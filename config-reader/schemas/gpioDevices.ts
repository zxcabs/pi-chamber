import { z } from 'zod'

export const gpioDeviceSchema = z
    .object({
        name: z.string({
            required_error: 'GPIO device name is required',
        }),
        gpio: z
            .number({
                required_error: 'GPIO device number is required',
                invalid_type_error: 'GPIO device must be a number',
            })
            .min(0)
            .max(40),
        initial_value: z.number({ invalid_type_error: 'GPIO device must be a number' }).min(0).max(1).default(0),
    })
    .strict()

export const gpioDevicesSchema = z
    .array(gpioDeviceSchema)
    .refine(items => new Set(items.map(i => i.name)).size === items.length, {
        message: 'GPIO device name must be unique',
    })


