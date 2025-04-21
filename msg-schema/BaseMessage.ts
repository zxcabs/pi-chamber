import { v4 as randomUUID } from 'uuid'
import { z, ZodLiteral, type ZodTypeAny } from 'zod'

const BaseMessageTypeSchema = z
    .string({
        required_error: 'Message type is required',
    })
    .min(1)
    .describe('Message type should not be empty')
const BaseMessageUidSchema = z
    .string({
        required_error: 'Message type is required',
    })
    .uuid()
    .describe('Message uid should not be empty')
const BaseMessageTimestampSchema = z.number().finite().describe('Message timestamp')
const BaseMessagePayoadSchema = z.object({}).nullable().optional().describe('Message payload')

export type TBaseMessageType = z.infer<typeof BaseMessageTypeSchema>

export const BaseMessageSchema = z.object({
    type: BaseMessageTypeSchema,
    uid: BaseMessageUidSchema,
    timestamp: BaseMessageTimestampSchema,
    payload: BaseMessagePayoadSchema,
})

export type TBaseMessage = z.infer<typeof BaseMessageSchema>

export type SchemaWithType<T extends string> = ZodTypeAny & {
    shape: { type: ZodLiteral<T> }
}

export function createMessage<S extends SchemaWithType<T>, T extends string>(
    schema: S,
    type: T,
    payload?: Object | undefined,
): z.infer<S> {
    return schema.parse({
        uid: randomUUID(),
        type,
        timestamp: Date.now(),
        payload,
    })
}
