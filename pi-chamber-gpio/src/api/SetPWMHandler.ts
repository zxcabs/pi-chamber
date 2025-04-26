import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import {
    createResponseSetPWMMessage,
    NAME_SET_PWM,
    type TRequestSetPWMMessage,
} from '../../../msg-schema/SetPWMDeviceMessage.ts'

export default class SetPWMHandler extends BaseApiHandler<TRequestSetPWMMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, NAME_SET_PWM)
    }

    async messageHandler(message: TRequestSetPWMMessage) {
        const status = await this.ctx.pwmDevices.write(message.payload.name, message.payload.value)
        this.ctx.ebus.emit(createResponseSetPWMMessage(message.uid, { device: status }))
    }
}
