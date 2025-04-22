import {
    createRsToggleGPIODeviceMessage,
    TYPES,
    type TRqToggleGPIODeviceMessage,
} from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import type { TGPIOValue } from '../devices/types/IGPIODevice.type.ts'

export default class ToggleGPIODeviceHandler extends BaseApiHandler<TRqToggleGPIODeviceMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.RQ_TOGGLE_GPIO_DEVICE)
    }

    async messageHandler(message: TRqToggleGPIODeviceMessage) {
        const current = await this.ctx.gpioDevices.read(message.payload.name)
        const toggled = await this.ctx.gpioDevices.write(current.name, (current.value ^ 1) as TGPIOValue)
        this.ctx.server.sendMessage(createRsToggleGPIODeviceMessage(toggled))
    }
}
