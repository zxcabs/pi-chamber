import { readFileSync } from 'node:fs'
import { parse } from 'smol-toml'
import z from 'zod'
import type { ReadonlyDeep } from 'type-fest'

const generalSchema = z
    .object({
        gpio_server_sock: z.string({
            required_error: 'gpio_server_sock is required',
            invalid_type_error: 'gpio_server_sock must be a string',
        }),
        chamber_temperature_sensors: z.array(z.string()).min(1, {
            message: 'At least one chamber temperature sensor must be specified',
        }),
        pigpio_server_host: z.string().default('localhost'),
        pigpio_server_port: z.number().min(1).max(65535).default(8888),
    })
    .required()
    .strict()

export type TGeneralConfig = ReadonlyDeep<z.infer<typeof generalSchema>>

const webServerSchema = z
    .object({
        port: z
            .number({
                required_error: 'port is required',
                invalid_type_error: 'port must be a number',
            })
            .min(1)
            .max(65535),
        ui_dir: z.string({
            required_error: 'ui_dir is required',
            invalid_type_error: 'ui_dir must be a string',
        }),
    })
    .strict()

export type TWebServerConfig = ReadonlyDeep<z.infer<typeof webServerSchema>>

const temperatureSensorSchema = z
    .object({
        name: z.string({
            required_error: 'Temperature sensor name is required',
        }),
        type: z.string(),
        options: z.record(z.unknown()),
    })
    .strict()

export type TTemeperatureSensorConfig = ReadonlyDeep<z.infer<typeof temperatureSensorSchema>>

const temperatureSensorsSchema = z
    .array(temperatureSensorSchema)
    .min(1, { message: 'At least one temperature sensor must be configured' })
    .refine(items => new Set(items.map(i => i.name)).size === items.length, {
        message: 'Temperature sensor names must be unique',
    })

export type TTemeperatureSensorsConfig = ReadonlyDeep<z.infer<typeof temperatureSensorsSchema>>

const lightSchema = z
    .object({
        name: z.string({
            required_error: 'Light name is required',
        }),
        gpio: z
            .number({
                required_error: 'Light gpio number is required',
                invalid_type_error: 'Light gpio must be a number',
            })
            .min(0)
            .max(40),
    })
    .strict()

export type TLightConfig = ReadonlyDeep<z.infer<typeof lightSchema>>

const lightsSchema = z
    .array(lightSchema)
    .refine(items => new Set(items.map(i => i.name)).size === items.length, { message: 'Light names must be unique' })

export type TLightsConfig = ReadonlyDeep<z.infer<typeof lightsSchema>>

const configSchema = z
    .object({
        general: generalSchema,
        web_server: webServerSchema,
        temperature_sensors: temperatureSensorsSchema,
        lights: lightsSchema,
    })
    .strict()

export type TConfig = ReadonlyDeep<z.infer<typeof configSchema>>

export function readConfig(configPath: string): TConfig {
    if (!configPath) {
        throw new Error('Config path not provided')
    }

    try {
        const configData = readFileSync(configPath, { encoding: 'utf8' })

        if (!configData.trim()) {
            throw new Error('Config file is empty')
        }

        const parsed = parse(configData)
        return configSchema.parse(parsed)
    } catch (err) {
        if (err instanceof z.ZodError) {
            throw new Error(`Config validation error: ${err.errors.map(e => e.message).join('; ')}`)
        }
        throw new Error(`Failed to read config: ${err instanceof Error ? err.message : String(err)}`)
    }
}
