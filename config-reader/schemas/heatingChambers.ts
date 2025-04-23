import { z } from 'zod'
import { nameSchema as temperatureSensorNameSchema } from './temperatureSensors.ts'
import { nameSchema as gpioNameSchema } from './gpioDevices.ts'
import { uniqueBy } from '../../zod-helps/uniqueBy.ts'
import { unique } from '../../zod-helps/unique.ts'

export const nameSchema = z.string({
    required_error: 'Heating chamber name is required',
})
export const temperatureSensorsSchema = z
    .array(temperatureSensorNameSchema)
    .min(1, { message: 'At least one heating chamber temperature sensors must be configured' })
    .superRefine(unique('Heating chamber temperature sensor'))
export const lightsSchema = z.array(gpioNameSchema).superRefine(unique('Heating chamber light')).optional()
export const heatersSchema = z
    .array(gpioNameSchema)
    .min(1, { message: 'At least one heating chamber heaters must be configured' })
    .superRefine(unique('Heating chamber heater'))
export const fansSchema = z
    .array(gpioNameSchema)
    .min(1, { message: 'At least one heating chamber fans must be configured' })
    .superRefine(unique('Heating chamber fan'))
export const activateFansTemperatureSchema = z.number().default(40)
export const lightsTimeoutSchema = z
    .number()
    .min(0)
    .default(15 * 60 * 1000)

export const heatingChamberSchema = z.object({
    name: nameSchema,
    temperature_sensors: temperatureSensorsSchema,
    lights: lightsSchema,
    heaters: heatersSchema,
    fans: fansSchema,
    activate_fans_temperature: activateFansTemperatureSchema,
    lights_timeout: lightsTimeoutSchema,
})

export const heatingChambersSchema = z
    .array(heatingChamberSchema)
    .min(1, { message: 'At least one heating chamber must be configured' })
    .superRefine(uniqueBy('name', 'Heating chamber'))
