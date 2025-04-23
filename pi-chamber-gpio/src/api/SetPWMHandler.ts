import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import { createRsSetPWMMessage, TYPES, type TRqSetPWMMessage } from '../../../msg-schema/PWMDeviceMessage.ts'

export default class SetPWMHandler extends BaseApiHandler<TRqSetPWMMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.RQ_SET_PWM)
    }

    async messageHandler(message: TRqSetPWMMessage) {
        const status = await this.ctx.pwmDevices.write(message.payload.name, message.payload.value)
        this.ctx.ebus.emit(createRsSetPWMMessage(status))
    }
}
