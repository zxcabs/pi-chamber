import { z } from 'zod'
import { generalSchema } from './general.ts'
import { webServerSchema } from './webServer.ts'
import { temperatureSensorsSchema } from './temperatureSensors.ts'
import { gpioDevicesSchema } from './gpioDevices.ts'
import { pwmDevicesSchema } from './pwmDevices.ts'

// Full config schema
export const configSchema = z.object({
    general: generalSchema,
    web_server: webServerSchema,
    temperature_sensors: temperatureSensorsSchema,
    gpio_devices: gpioDevicesSchema,
    pwm_devices: pwmDevicesSchema,
})
