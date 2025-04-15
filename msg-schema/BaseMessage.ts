import { randomUUID } from 'crypto'
import { z, ZodLiteral, type ZodTypeAny } from 'zod'

export const BaseMessageSchema = z.object({
    type: z.string({
        required_error: 'message type is required',
    }),
    uid: z.string().uuid(),
    timestamp: z.number(),
})

export type TBaseMessage = z.infer<typeof BaseMessageSchema>

type SchemaWithType<T extends string> = ZodTypeAny & {
    shape: { type: ZodLiteral<T> }
}

export function createMessage<S extends SchemaWithType<T>, T extends string>(
    schema: S,
    type: T,
    extendObject = {},
): z.infer<S> {
    return schema.parse({
        uid: randomUUID(),
        type,
        timestamp: Date.now(),
        ...extendObject,
    })
}
