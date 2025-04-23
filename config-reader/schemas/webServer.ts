import { z } from 'zod'

export const webServerSchema = z
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
