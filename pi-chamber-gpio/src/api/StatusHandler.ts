import { createRsStatusMessage, TYPES, type TRqStatusMessage } from '../../../msg-schema/StatusMessage.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'

export default class StatusHandler extends BaseApiHandler<TRqStatusMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.RQ_STATUS)
    }

    async messageHandler() {
        const tempStatus = await this.ctx.temperatureSensors.readAll()
        const gpioDevices = await this.ctx.gpioDevices.readAll()

        const statusMsg = createRsStatusMessage({
            temperature_sensors: tempStatus,
            gpio_devices: gpioDevices,
        })

        this.ctx.server.sendMessage(statusMsg)
    }
}
