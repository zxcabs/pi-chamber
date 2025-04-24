import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import {
    createRsHeatingChambersMessage,
    TYPES,
    type TRqHeatingChambersMessage,
    type TRsHeatingChambersPayload,
} from '../../../msg-schema/HeatingChamberMessage.ts'

export default class HeatingChambersHandler extends BaseApiHandler<TRqHeatingChambersMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.RQ_HEATING_CHAMBERS)
    }

    async getHeatingChambersPayload(): Promise<TRsHeatingChambersPayload> {
        const chambers = await this.ctx.heatingChambers.readAll()

        return {
            heating_chambers: chambers,
        }
    }

    async messageHandler(message: TRqHeatingChambersMessage) {
        const payload = await this.getHeatingChambersPayload()
        this.ctx.ebus.emit(createRsHeatingChambersMessage(payload, message.uid))
    }
}
