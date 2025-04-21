import { ZodAny } from 'zod'
import { BaseMessageSchema, type TBaseMessage } from './BaseMessage.ts'
import { PingSchema, PongSchema, TYPES as PP_TYPES } from './PingPongMessage.ts'
import { EventStatusSchema, RqStatusSchema, RsStatusSchema, TYPES as STATUS_TYPES } from './StatusMessage.ts'
import {
    RqToggleGPIODeviceMessageSchema,
    RsToggleGPIODeviceMessageSchema,
    TYPES as TOGGLE_TYPES,
} from './ToggleGPIODeviceMessage.ts'
import { RqShutdownSchema, TYPES as SHUTDOWN_TYPES } from './ShutdownMessage.ts'

const SCHEMAS_BY_TYPE = {
    [PP_TYPES.PING]: PingSchema,
    [PP_TYPES.PONG]: PongSchema,

    [STATUS_TYPES.RQ_STATUS]: RqStatusSchema,
    [STATUS_TYPES.RS_STATUS]: RsStatusSchema,
    [STATUS_TYPES.EVENT_STATUS]: EventStatusSchema,

    [TOGGLE_TYPES.RQ_TOGGLE_GPIO_DEVICE]: RqToggleGPIODeviceMessageSchema,
    [TOGGLE_TYPES.RS_TOGGLE_GPIO_DEVICE]: RsToggleGPIODeviceMessageSchema,

    [SHUTDOWN_TYPES.RQ_SHUTDOWN]: RqShutdownSchema,
}

export default function parceMessage(data: string): TBaseMessage {
    let json = {}

    try {
        json = JSON.parse(data)
    } catch (e) {
        console.error('ERROR: ', e, '\nData:', data)
    }

    const msg = BaseMessageSchema.parse(json)
    const schema: ZodAny = SCHEMAS_BY_TYPE[msg?.type]

    return schema ? schema.parse(json) : msg
}
