import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import { createResponseMessage, NAME, type TRequestMessage } from '../../../msg-schema/SetPWMDevicesValueMessage.ts'

export default class SetPWMsHandler extends BaseApiHandler<TRequestMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, NAME)
    }

    async messageHandler(message: TRequestMessage) {
        const devices = await this.ctx.pwmDevices.writeByNames(message.payload.devices)
        this.ctx.ebus.emit(createResponseMessage(message.uid, { devices }))
    }
}
