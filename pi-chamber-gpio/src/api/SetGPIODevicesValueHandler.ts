import { NAME, type TRequestMessage, createResponseMessage } from '../../../msg-schema/SetGPIODevicesValueMessage.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'

export default class SetGPIODevicesValueHandler extends BaseApiHandler<TRequestMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, NAME)
    }

    protected async messageHandler(message: TRequestMessage) {
        const devices = await this.ctx.gpioDevices.writeByNames(message.payload.devices)

        this.ctx.ebus.emit(
            createResponseMessage(message.uid, {
                devices,
            }),
        )
    }
}
