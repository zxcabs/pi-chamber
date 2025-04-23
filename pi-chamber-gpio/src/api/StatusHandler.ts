import {
    createEventStatusMessage,
    createRsStatusMessage,
    TYPES,
    type TRqStatusMessage,
    type TRsStatusMessagePayload,
} from '../../../msg-schema/StatusMessage.ts'
import type { IGPIODeviceResult } from '../devices/types/IGPIODevice.type.ts'
import type { IPWMDeviceResult } from '../devices/types/IPWMDevice.type.ts'
import type { ITemperatureSensorReadResult } from '../devices/types/ITemperatureSensor.type.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'

export default class StatusHandler extends BaseApiHandler<TRqStatusMessage> {
    private timerId: ReturnType<typeof setTimeout>

    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.RQ_STATUS)
        this.sendEventStatus()
    }

    private async getStatus(): Promise<
        [Array<ITemperatureSensorReadResult>, Array<IGPIODeviceResult>, Array<IPWMDeviceResult>]
    > {
        return await Promise.all([
            this.ctx.temperatureSensors.readAll(),
            this.ctx.gpioDevices.readAll(),
            this.ctx.pwmDevices.readAll(),
        ])
    }

    private async getStatusPayload(): Promise<TRsStatusMessagePayload> {
        const [temperature_sensors, gpio_devices, pwm_devices] = await this.getStatus()

        return {
            temperature_sensors,
            gpio_devices,
            pwm_devices,
        }
    }

    private async sendEventStatus() {
        const payload = await this.getStatusPayload()
        const statusEvent = createEventStatusMessage(payload)
        this.ctx.ebus.emit(statusEvent)
        this.timerId = setTimeout(() => this.sendEventStatus(), this.ctx.config.general.status_timeinterval)
    }

    async messageHandler(): Promise<void> {
        const payload = await this.getStatusPayload()
        const statusMsg = createRsStatusMessage(payload)
        this.ctx.ebus.emit(statusMsg)
    }

    public destroy(): void {
        clearTimeout(this.timerId)
        super.destroy()
    }
}
