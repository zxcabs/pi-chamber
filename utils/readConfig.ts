import { readFileSync } from 'node:fs'
import { parse } from 'smol-toml'
import z from 'zod'
import type { ReadonlyDeep, } from 'type-fest'

const generalSchema = z.object({
    gpio_server_sock: z.string({
        required_error: "gpio_server_sock is required",
        invalid_type_error: "gpio_server_sock must be a string"
    }),
    chamber_temperature_sensors: z.array(z.string())
}).required()

export type TGeneralConfig = ReadonlyDeep<z.infer<typeof generalSchema>>

const webServerSchema = z.object({
    port: z.number({
        required_error: "port is required",
        invalid_type_error: "port must be a number"
    }),
    ui_dir: z.string({
        required_error: "ui_dir is required",
        invalid_type_error: "ui_dir must be a string"
    })
})

export type TWebServerConfig = ReadonlyDeep<z.infer<typeof webServerSchema>>

const temperatureSensorSchema = z.object({
    name: z.string({
        required_error: "Temperature sensor name is required"
    }),
    type: z.string(),
    options: z.any()
})

export type TTemeperatureSensorConfig = ReadonlyDeep<z.infer<typeof temperatureSensorSchema>>

const temperatureSensorsSchema = z.array(temperatureSensorSchema).min(1)
    .refine(
        (items: Array<TTemeperatureSensorConfig>) => new Set(items.map((i: TTemeperatureSensorConfig): string => i.name)).size === items.length,
        { message: "Temperature sensor name should be unique" }
    )

export type TTemeperatureSensorsConfig = ReadonlyDeep<z.infer<typeof temperatureSensorsSchema>>

const configSchema = z.object({
    general: generalSchema,
    web_server: webServerSchema,
    temperature_sensors: temperatureSensorsSchema
});

export type TConfig = ReadonlyDeep<{
    general: TGeneralConfig,
    web_server: TWebServerConfig,
    temperature_sensors: TTemeperatureSensorsConfig
}>

export function readConfig(configPath: string): TConfig {
    if (!configPath) throw new Error("Config path not found")
    const configData = readFileSync(configPath, { encoding: 'utf8' })

    return configSchema.parse(parse(configData)) as TConfig
}