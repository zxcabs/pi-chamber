import z from 'zod'

export const generalSchema = z
    .object({
        gpio_server_sock: z.string({
            required_error: 'gpio_server_sock is required',
            invalid_type_error: 'gpio_server_sock must be a string',
        }),
        status_timeinterval: z.number().min(100).max(60000).default(1000).describe('Status check time interval'),
    })
    .required()
    .strict()
