import type { z } from 'zod'
import type { ReadonlyDeep } from 'type-fest'
import { generalSchema } from './schemas/general.ts'
import { webServerSchema } from './schemas/webServer.ts'
import { temperatureSensorSchema, temperatureSensorsSchema } from './schemas/temperatureSensors.ts'
import { gpioDeviceSchema, gpioDevicesSchema } from './schemas/gpioDevices.ts'
import { pwmDeviceSchema, pwmDevicesSchema } from './schemas/pwmDevices.ts'
import { heatingChamberSchema, heatingChambersSchema } from './schemas/heatingChambers.ts'
import { configSchema } from './schemas/config.ts'

export type TGeneralConfig = ReadonlyDeep<z.infer<typeof generalSchema>>
export type TWebServerConfig = ReadonlyDeep<z.infer<typeof webServerSchema>>

export type TTemeperatureSensorConfig = ReadonlyDeep<z.infer<typeof temperatureSensorSchema>>
export type TTemeperatureSensorsConfig = ReadonlyDeep<z.infer<typeof temperatureSensorsSchema>>

export type TGPIODeviceConfig = ReadonlyDeep<z.infer<typeof gpioDeviceSchema>>
export type TGPIODevicesConfig = ReadonlyDeep<z.infer<typeof gpioDevicesSchema>>

export type TPWMDeviceConfig = ReadonlyDeep<z.infer<typeof pwmDeviceSchema>>
export type TPWMDevicesConfig = ReadonlyDeep<z.infer<typeof pwmDevicesSchema>>

export type THeatingChamberConfig = ReadonlyDeep<z.infer<typeof heatingChamberSchema>>
export type THeatingChambersConfig = ReadonlyDeep<z.infer<typeof heatingChambersSchema>>

// Full config type
export type TConfig = ReadonlyDeep<z.infer<typeof configSchema>>
