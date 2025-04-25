import type { TBaseMessage, TBaseMessageType } from '../../../msg-schema/BaseMessage.ts'
import type EventBus from './EventBus.ts'

export default class EventBusBridge {
    private readonly unsubscribers: (() => void)[] = []

    constructor(protected readonly eventBus: EventBus) {}

    protected setupEBusListener(type: TBaseMessageType, handler: (msg: TBaseMessage) => void): void {
        const unsubscribe = this.eventBus.on(type, handler.bind(this))
        this.registerUnsubscriber(unsubscribe)
    }

    protected registerUnsubscriber(unsubscriber: () => void): void {
        this.unsubscribers.push(unsubscriber)
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
