import { z } from 'zod'

export const STATUS_ON = 'ON' as const
export const STATUS_OFF = 'OFF' as const
export const STATUS_ERROR = 'ERROR' as const

export const nameSchema = z.string()
export const updateAtSchema = z.number()
export const statusSchema = z.enum([STATUS_ON, STATUS_OFF, STATUS_ERROR])
export const heaterValueSchema = z.number()
export const fanStatusSchema = z.enum([STATUS_ON, STATUS_OFF, STATUS_ERROR])
export const lightStatusSchema = z.enum([STATUS_ON, STATUS_OFF, STATUS_ERROR])
export const currentTemperatureSchema = z.number()
export const targetTemperatureSchema = z.number()

export const HEATING_CHAMBER_DEVICE_LIGHT = 'light'
export const HEATING_CHAMBER_DEVICE_FAN = 'fan'

export const deviceNameSchema = z.enum([HEATING_CHAMBER_DEVICE_LIGHT, HEATING_CHAMBER_DEVICE_FAN])
export const deviceValueSchema = z.union([z.literal(0), z.literal(1)])

export const heatingChamberStateSchema = z
    .object({
        updateAt: updateAtSchema,
        status: statusSchema,
        heaterValue: heaterValueSchema,
        fan_status: fanStatusSchema,
        light_status: lightStatusSchema,
        current_temperature: currentTemperatureSchema,
        target_temperature: targetTemperatureSchema,
    })
    .describe('Heating chamber state')
