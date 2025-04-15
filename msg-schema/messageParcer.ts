import { ZodAny } from 'zod'
import { BaseMessageSchema, type TBaseMessage } from './BaseMessage.ts'
import { PingSchema, PongSchema, TYPES as PP_TYPES } from './PingPongMessage.ts'
import { RqStatusSchema, RsStatusSchema, TYPES as STATUS_TYPES } from './StatusMessage.ts'

const SCHEMAS_BY_TYPE = {
    [PP_TYPES.PING]: PingSchema,
    [PP_TYPES.PONG]: PongSchema,
    [STATUS_TYPES.RQ_STATUS]: RqStatusSchema,
    [STATUS_TYPES.RS_STATUS]: RsStatusSchema,
}

export default function parceMessage(data: string): TBaseMessage {
    const json = JSON.parse(data)
    const msg = BaseMessageSchema.parse(json)
    const schema: ZodAny = SCHEMAS_BY_TYPE[msg.type]

    return schema ? schema.parse(json) : msg
}
