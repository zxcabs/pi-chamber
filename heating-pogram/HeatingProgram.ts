import { z } from 'zod'

const programNameSchema = z.string().min(1)

const intervalTargetTemperatureSchema = z.number()
const intervalDurationSchema = z.number().min(1000)

const intervalSchema = z.object({
    temperature: intervalTargetTemperatureSchema,
    duration: intervalDurationSchema,
})

export const heatingProgramSchema = z.object({
    name: programNameSchema,
    intervals: intervalSchema.array().min(1),
})

export type THeatingInterval = z.infer<typeof intervalSchema>
export type THeatingProgram = z.infer<typeof heatingProgramSchema>
