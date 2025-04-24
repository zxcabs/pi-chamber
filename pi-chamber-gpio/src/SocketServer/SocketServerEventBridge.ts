import type EventBus from '../EventBus.ts'
import type PIChamberGPIOServer from './PIChamberGPIOServer.ts'
import { safeParseMessage, type TSafeParseResult } from '../../../msg-schema/messageParser.ts'
import type { TBaseMessage, TBaseMessageType } from '../../../msg-schema/BaseMessage.ts'
import { TYPES as PP_TYPES } from '../../../msg-schema/PingPongMessage.ts'
import { TYPES as STATUS_TYPES } from '../../../msg-schema/StatusMessage.ts'
import { TYPES as TOGGLE_TYPES } from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import { TYPES as PWM_TYPES } from '../../../msg-schema/PWMDeviceMessage.ts'
import { TYPES as HC_TYPES } from '../../../msg-schema/HeatingChamberMessage.ts'

export class SocketServerEventBridge {
    private readonly unsubscribers: (() => void)[] = []
    private readonly socketMessageTypes: TBaseMessageType[] = [
        PP_TYPES.PONG,
        STATUS_TYPES.RS_STATUS,
        STATUS_TYPES.EVENT_STATUS,
        TOGGLE_TYPES.RS_TOGGLE_GPIO_DEVICE,
        PWM_TYPES.RS_SET_PWM,
        HC_TYPES.RS_HEATING_CHAMBERS,
    ]

    constructor(
        private readonly server: PIChamberGPIOServer,
        private readonly eventBus: EventBus,
    ) {
        this.setupServerListeners()
        this.setupEBusListeners()
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
                    this.eventBus.emit(result.data)
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

    private parseAndValidateMessage(message: string): TSafeParseResult<TBaseMessage> {
        return safeParseMessage(message)
    }

    private setupEBusListeners(): void {
        this.socketMessageTypes.forEach(type => {
            const unsubscribe = this.eventBus.on(type, this.handleEventBusMessage.bind(this))
            this.registerUnsubscriber(unsubscribe)
        })
    }

    private handleEventBusMessage(msg: TBaseMessage): void {
        try {
            const serialized = JSON.stringify(msg)
            this.server.broadcast(serialized)
        } catch (error) {
            this.handleSerializationError(error, msg)
        }
    }

    private registerUnsubscriber(unsubscriber: () => void): void {
        this.unsubscribers.push(unsubscriber)
    }

    private handleMessageError(error: Error): void {
        console.error('Message processing error:', error.message)
    }

    private handleSerializationError(error: unknown, message: TBaseMessage): void {
        console.error('Failed to serialize message:', message, 'Error:', error)
    }

    private handleProcessingError(error: unknown): void {
        console.error('Unexpected processing error:', error)
    }

    public release(): void {
        this.unsubscribers.forEach(unsubscribe => {
            try {
                unsubscribe()
            } catch (error) {
                console.error('Error during unsubscription:', error)
            }
        })
        this.unsubscribers.length = 0
    }
}
