import {
    createResponseToggleGPIOMessage,
    NAME_TOGGLE_GPIO_DEVICE,
    type TRequestToggleGPIODeviceMessage,
} from '../../../msg-schema/ToggleGPIODeviceMessage.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import type { TGPIOValue } from '../devices/types/IGPIODevice.type.ts'

export default class ToggleGPIODeviceHandler extends BaseApiHandler<TRequestToggleGPIODeviceMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, NAME_TOGGLE_GPIO_DEVICE)
    }

    async messageHandler(message: TRequestToggleGPIODeviceMessage) {
        const current = await this.ctx.gpioDevices.read(message.payload.name)
        const toggled = await this.ctx.gpioDevices.write(current.name, (current.value ^ 1) as TGPIOValue)
        this.ctx.ebus.emit(createResponseToggleGPIOMessage(message.uid, { device: toggled }))
    }
}
