import { ZodSchema } from 'zod'
import { BaseMessageSchema, type TBaseMessage } from './BaseMessage.ts'
import { PingSchema, PongSchema, TYPES as PP_TYPES } from './PingPongMessage.ts'
import { EventStatusSchema, RqStatusSchema, RsStatusSchema, TYPES as STATUS_TYPES } from './StatusMessage.ts'
import {
    RqToggleGPIODeviceMessageSchema,
    RsToggleGPIODeviceMessageSchema,
    TYPES as TOGGLE_TYPES,
} from './ToggleGPIODeviceMessage.ts'
import { TYPES as PWM_TYPES, RqSetPWMMessageSchema, RsSetPWMMessageSchema } from './PWMDeviceMessage.ts'
import { RqShutdownSchema, TYPES as SHUTDOWN_TYPES } from './ShutdownMessage.ts'
import {
    RqHeatingChambersSchema,
    RsHeatingChambersSchema,
    TYPES as HC_TYPES,
    EventHeatingChamberStateSchema,
} from './HeatingChamberMessage.ts'

const SCHEMAS_BY_TYPE = {
    [PP_TYPES.PING]: PingSchema,
    [PP_TYPES.PONG]: PongSchema,

    [STATUS_TYPES.RQ_STATUS]: RqStatusSchema,
    [STATUS_TYPES.RS_STATUS]: RsStatusSchema,
    [STATUS_TYPES.EVENT_STATUS]: EventStatusSchema,

    [TOGGLE_TYPES.RQ_TOGGLE_GPIO_DEVICE]: RqToggleGPIODeviceMessageSchema,
    [TOGGLE_TYPES.RS_TOGGLE_GPIO_DEVICE]: RsToggleGPIODeviceMessageSchema,

    [PWM_TYPES.RQ_SET_PWM]: RqSetPWMMessageSchema,
    [PWM_TYPES.RS_SET_PWM]: RsSetPWMMessageSchema,

    [HC_TYPES.RQ_HEATING_CHAMBERS]: RqHeatingChambersSchema,
    [HC_TYPES.RS_HEATING_CHAMBERS]: RsHeatingChambersSchema,
    [HC_TYPES.EVENT_HEATING_CHAMBER_STATE]: EventHeatingChamberStateSchema,

    [SHUTDOWN_TYPES.RQ_SHUTDOWN]: RqShutdownSchema,
}

export default function parseMessage(data: string): TBaseMessage {
    let json = {}

    try {
        json = JSON.parse(data)
    } catch (e) {
        console.error('ERROR: ', e, '\nData:', data)
    }

    const msg = BaseMessageSchema.parse(json)
    const schema: ZodSchema = SCHEMAS_BY_TYPE[msg?.type]

    return schema ? schema.parse(json) : msg
}

export type TSafeParseResult<T> = { success: true; data: T; error?: Error } | { success: false; error: Error }

export function safeParseMessage<T extends TBaseMessage>(msgString: string): TSafeParseResult<T> {
    let parsedJson: T

    try {
        parsedJson = JSON.parse(msgString) as T
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error('Invalid JSON'),
        }
    }

    const messageType = parsedJson.type

    if (!messageType) {
        return {
            success: false,
            error: new Error('Message type is missing'),
        }
    }

    const schema = SCHEMAS_BY_TYPE[messageType]

    if (!schema) {
        return {
            success: false,
            error: new Error(`Unknown message type: ${messageType}`),
        }
    }

    const result = schema.safeParse(parsedJson)

    if (!result.success) {
        return {
            success: false,
            error: new Error(result.error.message),
        }
    }

    return {
        success: true,
        data: result.data as T,
    }
}
