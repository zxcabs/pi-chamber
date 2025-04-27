import { readFileSync } from 'node:fs'
import { parse } from 'smol-toml'
import z from 'zod'
import type { TConfig } from './readConfig.types.ts'
import { configSchema } from './schemas/config.ts'

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
