import { z } from 'zod'

export const nameSchema = z.string({
    required_error: 'Temperature sensor name is required',
})

export const typeSchema = z.string()

export const MAX31865OptionsSchema = z.object({
    bus: z.number().min(0).default(0),
    device: z.number().min(0).default(0),
    wires: z.number().min(2).max(4).default(3),
    rtdNominal: z.number().min(0).default(100),
    refResistor: z.number().min(0).default(430),
})

export const temperatureSensorSchema = z
    .object({
        name: nameSchema,
        type: typeSchema,
        options: MAX31865OptionsSchema,
    })
    .strict()

export const temperatureSensorsSchema = z
    .array(temperatureSensorSchema)
    .min(1, { message: 'At least one temperature sensor must be configured' })
    .refine(items => new Set(items.map(i => i.name)).size === items.length, {
        message: 'Temperature sensor names must be unique',
    })
