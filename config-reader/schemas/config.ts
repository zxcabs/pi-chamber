import { z } from 'zod'
import { generalSchema } from './general.ts'
import { webServerSchema } from './webServer.ts'
import { temperatureSensorsSchema } from './temperatureSensors.ts'
import { gpioDevicesSchema } from './gpioDevices.ts'
import { pwmDevicesSchema } from './pwmDevices.ts'
import { heatingChambersSchema } from './heatingChambers.ts'
import { getMissingElements } from '../../utils/getMissingElements.ts'

// Full config schema
export const configSchema = z
    .object({
        general: generalSchema,
        web_server: webServerSchema,
        temperature_sensors: temperatureSensorsSchema,
        gpio_devices: gpioDevicesSchema,
        pwm_devices: pwmDevicesSchema,
        heating_chambers: heatingChambersSchema,
    })
    .superRefine((val, ctx) => {
        val.heating_chambers.forEach(heatingChamber => {
            const missingTemperatureSensors = getMissingElements(
                val.temperature_sensors.map(t => t.name),
                heatingChamber.temperature_sensors,
            )

            if (missingTemperatureSensors.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${heatingChamber.name}. Unknown temperature sensor: ${missingTemperatureSensors.join(', ')}`,
                })
            }

            if (heatingChamber.lights) {
                const missingLights = getMissingElements(
                    val.gpio_devices.map(t => t.name),
                    heatingChamber.lights,
                )

                if (missingLights.length) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `${heatingChamber.name}. Unknown light name in gpio_devices: ${missingLights.join(', ')}`,
                    })
                }
            }

            const missingHeaters = getMissingElements(
                val.pwm_devices.map(t => t.name),
                heatingChamber.heaters,
            )

            if (missingHeaters.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${heatingChamber.name}. Unknown heater name in pwm_devices: ${missingHeaters.join(', ')}`,
                })
            }

            const missingFans = getMissingElements(
                val.gpio_devices.map(t => t.name),
                heatingChamber.fans,
            )

            if (missingFans.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${heatingChamber.name}. Unknown fan name in gpio_devices: ${missingFans.join(', ')}`,
                })
            }
        })
    })
