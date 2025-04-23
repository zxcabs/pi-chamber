import { createPongMessage, TYPES, type TPingMessage } from '../../../msg-schema/PingPongMessage.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'

export default class PingHandler extends BaseApiHandler<TPingMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.PING)
    }

    messageHandler(message: TPingMessage): void {
        this.ctx.ebus.emit(createPongMessage(message.uid))
    }
}
