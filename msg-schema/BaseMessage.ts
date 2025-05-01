import { v4 as randomUUID } from 'uuid'
import { z } from 'zod'
import safeJsonParse from '../utils/safeJsonParse.ts'

export namespace Message {
    export const TYPE_REQUEST = 'REQUEST' as const
    export const TYPE_RESPONSE = 'RESPONSE' as const
    export const TYPE_ERROR = 'ERROR' as const
    export const TYPE_EVENT = 'EVENT' as const

    export const typeSchema = z.union([
        z.literal(TYPE_REQUEST),
        z.literal(TYPE_RESPONSE),
        z.literal(TYPE_ERROR),
        z.literal(TYPE_EVENT),
    ])
    export const nameSchema = z
        .string({
            required_error: 'Message name is required',
        })
        .min(1)
        .describe('Message name should not be empty')
    export const uidSchema = z
        .string({
            required_error: 'Message uid is required',
        })
        .uuid()
        .describe('Message uid should not be empty')
    export const timestampSchema = z.number().finite().describe('Message timestamp')
    export const payoadSchema = z.object({}).describe('Message payload')

    export const typedNameSchema = z.string().refine(
        val => {
            const [type, name] = val.split(':')
            return typeSchema.safeParse(type).success && name !== undefined
        },
        {
            message: `Stirng must be a "type:name" (type: ${TYPE_REQUEST}|${TYPE_RESPONSE}|${TYPE_ERROR}|${TYPE_EVENT})`,
        },
    )

    export const typeNameSchema = z.object({
        type: typeSchema,
        name: nameSchema,
    })

    export const messageSchema = z.object({
        type: typeSchema,
        name: nameSchema,
        uid: uidSchema,
        timestamp: timestampSchema,
        payload: payoadSchema,
    })

    export const requestMessageSchema = messageSchema.extend({
        type: z.literal(TYPE_REQUEST),
    })

    export const responseMessagePayloadSchema = payoadSchema.extend({})

    export const responseMessageSchema = messageSchema.extend({
        type: z.literal(TYPE_RESPONSE),
        ruid: uidSchema,
        payload: responseMessagePayloadSchema,
    })

    export const errorMessagePayloadSchema = payoadSchema.extend({
        reason: z.string(),
    })
    export const errorMessageSchema = messageSchema.extend({
        type: z.literal(TYPE_ERROR),
        ruid: uidSchema,
        payload: errorMessagePayloadSchema,
    })

    export const eventMessageSchema = messageSchema.extend({
        type: z.literal(TYPE_EVENT),
    })

    export type TTypeRequest = typeof TYPE_REQUEST
    export type TTypeResponse = typeof TYPE_RESPONSE
    export type TTypeError = typeof TYPE_ERROR
    export type TTypeEvent = typeof TYPE_EVENT
    export type TType = z.infer<typeof typeSchema>
    export type TName = z.infer<typeof nameSchema>
    export type TTypedName = `${TType}:${TName}`
    export type TUid = z.infer<typeof uidSchema>
    export type TTimestamp = z.infer<typeof timestampSchema>
    export type TPayload = z.infer<typeof payoadSchema>
    export type TMessage = z.infer<typeof messageSchema>
    export type TRequestMessage = z.infer<typeof requestMessageSchema>
    export type TResponseMessage = z.infer<typeof responseMessageSchema>
    export type TErrorMessage = z.infer<typeof errorMessageSchema>
    export type TEventMessage = z.infer<typeof eventMessageSchema>
    export type TTypeNameMessage = z.infer<typeof typeNameSchema>

    export type TMessagePayloadSchema = typeof payoadSchema
    export type TMessageSchema = typeof messageSchema
    export type TRequestMessageSchema = typeof requestMessageSchema
    export type TResponseMessagePayloadSchema = typeof responseMessagePayloadSchema
    export type TResponseMessageSchema = typeof responseMessageSchema
    export type TErrorMessagePayloadSchema = typeof errorMessagePayloadSchema
    export type TErrorMessageSchema = typeof errorMessageSchema
    export type TEventMessageSchema = typeof eventMessageSchema

    export type TMessageSchemas =
        | TMessageSchema
        | TRequestMessageSchema
        | TResponseMessageSchema
        | TErrorMessageSchema
        | TEventMessageSchema

    export function createMessage<Type extends TType, Payload extends TPayload, Message extends TMessage = TMessage>(
        type: Type,
        name: TName,
        schema: z.ZodSchema,
        payload?: Payload,
        ruid?: TUid,
    ): Message {
        return schema.parse({
            type,
            name,
            uid: randomUUID(),
            ruid,
            timestamp: Date.now(),
            payload,
        }) as Message
    }

    export function createRequestMessage<
        Message extends TRequestMessage,
        Schema extends TRequestMessageSchema = TRequestMessageSchema,
        Payload extends TPayload = TPayload,
    >(name: TName, schema: Schema, payload?: Payload): Message {
        return createMessage(TYPE_REQUEST, name, schema, payload || {})
    }

    export function createResponseMessage<
        Message extends TResponseMessage,
        Schema extends TResponseMessageSchema = TResponseMessageSchema,
        Payload extends TPayload = TPayload,
    >(requestUID: TUid, name: TName, schema: Schema, payload?: Payload): Message {
        return createMessage(
            TYPE_RESPONSE,
            name,
            schema,
            {
                ...(payload || {}),
            },
            requestUID,
        )
    }

    export function createErrorMessage<
        Message extends TErrorMessage,
        Schema extends TErrorMessageSchema = TErrorMessageSchema,
        Payload extends TPayload = TPayload,
    >(requestUID: TUid, name: TName, schema: Schema, payload?: Payload): Message {
        return createMessage(
            TYPE_ERROR,
            name,
            schema,
            {
                ...(payload || {}),
            },
            requestUID,
        )
    }

    export function createEventMessage<
        Message extends TEventMessage,
        Schema extends TEventMessageSchema = TEventMessageSchema,
        Payload extends TPayload = TPayload,
    >(name: TName, schema: Schema, payload?: Payload): Message {
        return createMessage(TYPE_EVENT, name, schema, payload)
    }

    export type TSafeParseResult<T> = { success: true; data: T; error?: Error } | { success: false; error: Error }

    export function safeParseMessage<T extends TMessage>(message: T, schema: TMessageSchemas): TSafeParseResult<T> {
        const result = schema.safeParse(message)

        return result.success
            ? { success: true, data: result.data as T }
            : { success: false, error: new Error(result.error.message) }
    }

    export function safeParseTypeNameMessage(message: TTypeNameMessage & TMessage): TSafeParseResult<TTypeNameMessage> {
        const result = typeNameSchema.safeParse(message)

        return result.success
            ? { success: true, data: result.data as TTypeNameMessage }
            : { success: false, error: new Error(result.error.message) }
    }

    export function safeParseStringMessage<T extends TMessage>(
        jsonString: string,
        schema: TMessageSchemas,
    ): TSafeParseResult<T> {
        const parsedResult = safeJsonParse<T>(jsonString)

        if (!parsedResult.success) {
            return parsedResult
        }

        return safeParseMessage<T>(parsedResult.data, schema)
    }
}
