import type PIChamberGPIOServer from './PIChamberGPIOServer.ts'
import { Message } from '../../../msg-schema/BaseMessage.ts'
import MessageBusBridge from '../../../msg-bus/MessageBusBridge.ts'
import type MessageBus from '../../../msg-bus/MessageBus.ts'
import safeJsonParse from '../../../utils/safeJsonParse.ts'
import { NAME_PING, pingMessageSchema } from '../../../msg-schema/PingMessage.ts'
import type { TBusMessageType } from '../../../msg-bus/MessageBus.ts'
import { NAME_STATUS, requestStatusMessageSchema } from '../../../msg-schema/StatusMessage.ts'
import {
    NAME_TOGGLE_GPIO_DEVICE,
    requestToggleGPIODeviceMessageSchema,
} from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import { NAME_SET_PWM, requestSetPWMMessageSchema } from '../../../msg-schema/SetPWMDeviceMessage.ts'
import { NAME_HEATING_CHAMBERS, requestHeatingChambersSchema } from '../../../msg-schema/HeatingChamberMessage.ts'
import {
    NAME as NAME_SET_GPIO_DEVICES_VALUE,
    requestMessageSchema as requestSetGPIODevisesSchema,
} from '../../../msg-schema/SetGPIODevicesValueMessage.ts'
import {
    NAME as NAME_SET_HEATING_CHAMBER_DEVICES_VALUE,
    requestMessageSchema as requestSetHeatingChamberDevicesValue,
} from '../../../msg-schema/SetHeatingChamberDevicesValue.ts'

export default class SocketServerEventBridge extends MessageBusBridge {
    private readonly socketMessageTypes: TBusMessageType[] = [Message.TYPE_RESPONSE, Message.TYPE_EVENT]
    private readonly requestMessageMap: Record<string, Message.TRequestMessageSchema> = {
        [NAME_PING]: pingMessageSchema,
        [NAME_STATUS]: requestStatusMessageSchema,
        [NAME_TOGGLE_GPIO_DEVICE]: requestToggleGPIODeviceMessageSchema,
        [NAME_SET_PWM]: requestSetPWMMessageSchema,
        [NAME_HEATING_CHAMBERS]: requestHeatingChambersSchema,
        [NAME_SET_GPIO_DEVICES_VALUE]: requestSetGPIODevisesSchema,
        [NAME_SET_HEATING_CHAMBER_DEVICES_VALUE]: requestSetHeatingChamberDevicesValue,
    }

    constructor(
        private readonly server: PIChamberGPIOServer,
        bus: MessageBus,
    ) {
        super(bus)
        this.setupServerListeners()
        this.setupBusListeners()
    }

    private setupServerListeners(): void {
        const callback = this.handleServerMessage.bind(this)
        this.server.on('data', callback)
        this.registerUnsubscriber(() => this.server.off('data', callback))
    }

    private handleServerMessage(data: Buffer): void {
        try {
            const messages = this.parseBufferToMessages(data)

            messages.forEach(message => {
                const result = this.parseAndValidateMessage(message)

                if (result.success) {
                    this.bus.emit(result.data)
                } else {
                    this.handleMessageError(result.error)
                }
            })
        } catch (error) {
            this.handleProcessingError(error)
        }
    }

    private parseBufferToMessages(data: Buffer): string[] {
        return data
            .toString()
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)
    }

    private parseAndValidateMessage(jsonString: string): Message.TSafeParseResult<Message.TMessage> {
        const jsonResult = safeJsonParse<Message.TMessage>(jsonString)

        if (!jsonResult.success) {
            return jsonResult
        }

        const message = jsonResult.data
        const schema = this.requestMessageMap[message.name]

        if (!schema) {
            return {
                success: false,
                error: new Error(`Unknown message.name "${message.name}" on message: "${JSON.stringify(message)}"`),
            }
        }

        return Message.safeParseMessage(message, schema)
    }

    private setupBusListeners(): void {
        this.socketMessageTypes.forEach(type => {
            this.setupBusListener(type, this.handleEventBusMessage)
        })
    }

    private handleEventBusMessage(msg: Message.TMessage): void {
        try {
            const serialized = JSON.stringify(msg)
            this.server.broadcast(serialized)
        } catch (error) {
            this.handleSerializationError(error, msg)
        }
    }

    private handleMessageError(error: Error): void {
        console.error('Message processing error:', error.message)
    }

    private handleSerializationError(error: unknown, message: Message.TMessage): void {
        console.error('Failed to serialize message:', message, 'Error:', error)
    }

    private handleProcessingError(error: unknown): void {
        console.error('Unexpected processing error:', error)
    }
}
