import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import {
    createResponseHeatingChambersMessage,
    NAME_HEATING_CHAMBERS,
    type TRequestHeatingChambersMessage,
    type TResponseHeatingChambersPayload,
} from '../../../msg-schema/HeatingChamberMessage.ts'

export default class HeatingChambersHandler extends BaseApiHandler<TRequestHeatingChambersMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, NAME_HEATING_CHAMBERS)
    }

    async getHeatingChambersPayload(): Promise<TResponseHeatingChambersPayload> {
        const chambers = await this.ctx.heatingChambers.readAll()

        return {
            heating_chambers: chambers,
        }
    }

    async messageHandler(message: TRequestHeatingChambersMessage) {
        const payload = await this.getHeatingChambersPayload()
        this.ctx.ebus.emit(createResponseHeatingChambersMessage(message.uid, payload))
    }
}
