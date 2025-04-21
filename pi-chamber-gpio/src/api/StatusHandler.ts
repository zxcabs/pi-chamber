import {
    createEventStatusMessage,
    createRsStatusMessage,
    TYPES,
    type TRqStatusMessage,
    type TRsStatusMessagePayload,
} from '../../../msg-schema/StatusMessage.ts'
import type { IGPIODeviceResult } from '../devices/IGPIODevice.type.ts'
import type { ITemperatureSensorReadResult } from '../devices/ITemperatureSensor.type.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'

export default class StatusHandler extends BaseApiHandler<TRqStatusMessage> {
    private timerId: ReturnType<typeof setTimeout>

    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.RQ_STATUS)
        this.sendEventStatus()
    }

    private async getStatus(): Promise<[Array<ITemperatureSensorReadResult>, Array<IGPIODeviceResult>]> {
        return await Promise.all([this.ctx.temperatureSensors.readAll(), this.ctx.gpioDevices.readAll()])
    }

    private async getStatusPayload(): Promise<TRsStatusMessagePayload> {
        const [temperature_sensors, gpio_devices] = await this.getStatus()

        return {
            temperature_sensors,
            gpio_devices,
        }
    }

    private async sendEventStatus() {
        const payload = await this.getStatusPayload()
        const statusEvent = createEventStatusMessage(payload)
        this.ctx.server.sendMessage(statusEvent)
        this.timerId = setTimeout(() => this.sendEventStatus(), this.ctx.config.general.status_timeinterval)
    }

    async messageHandler(): Promise<void> {
        const payload = await this.getStatusPayload()
        const statusMsg = createRsStatusMessage(payload)
        this.ctx.server.sendMessage(statusMsg)
    }

    public destroy(): void {
        clearTimeout(this.timerId)
        super.destroy()
    }
}
