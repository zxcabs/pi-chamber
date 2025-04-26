import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'

import { NAME_PING, type TPingMessage } from '../../../msg-schema/PingMessage.ts'
import { createPongMessage } from '../../../msg-schema/PongMessage.ts'

export default class PingHandler extends BaseApiHandler<TPingMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, NAME_PING)
    }

    messageHandler(message: TPingMessage): void {
        this.ctx.ebus.emit(createPongMessage(message.uid))
    }
}
