import { Message } from '../../msg-schema/BaseMessage'
import type WS from './WS'

interface ICallbackFunction {
    (response: Message.TResponseMessage | Message.TErrorMessage): void
}

interface ITimeoutMessageData {
    name: Message.TName
    time: Message.TTimestamp
}

export class RequestWS {
    private reqMessageIds: Map<Message.TUid, ICallbackFunction> = new Map()
    private reqTimeouts: Map<Message.TUid, ITimeoutMessageData> = new Map()

    constructor(
        private ws: WS,
        private timeout: number = 2000,
    ) {
        this.setupWSEvent()
        this.setupTimeout()
    }

    public async make(message: Message.TRequestMessage): Promise<Message.TResponseMessage> {
        const promise = new Promise<Message.TResponseMessage>((res, rej) => {
            this.addCallback(message, message => {
                message.type === Message.TYPE_ERROR ? rej(message) : res(message)
            })
        })

        this.ws.send(message)

        return promise
    }

    private addCallback(message: Message.TRequestMessage, cb: ICallbackFunction): void {
        this.reqMessageIds.set(message.uid, cb)
        this.reqTimeouts.set(message.uid, {
            name: message.name,
            time: message.timestamp,
        })
    }

    private removeCallback(uid: Message.TUid) {
        this.reqMessageIds.delete(uid)
        this.reqTimeouts.delete(uid)
    }

    private setupWSEvent() {
        this.ws.registerStoreHandler(this.handleResponseMesage.bind(this))
    }

    private handleResponseMesage(message: Message.TResponseMessage | Message.TErrorMessage) {
        const cb = this.reqMessageIds.get(message.ruid)

        if (cb) {
            this.removeCallback(message.ruid)
            cb(message)
        }
    }

    private setupTimeout() {
        setInterval(() => {
            const now = Date.now()

            this.reqTimeouts.forEach(({ name, time }, uid) => {
                const dt = now - time
                if (dt > this.timeout) {
                    this.handleResponseMesage(
                        Message.createErrorMessage(uid, name, Message.errorMessageSchema, {
                            reason: 'WS client timeout',
                        }),
                    )
                }
            })
        }, this.timeout)
    }
}
