import { TYPES, type TRqShutdownMessage } from '../../../msg-schema/ShutdownMessage.ts'
import type PIChamberGPIO from '../PIChamberGPIO.ts'
import { BaseApiHandler } from './BaseApiHandler.ts'
import { exec } from 'child_process'

export default class ShutdownHandler extends BaseApiHandler<TRqShutdownMessage> {
    constructor(ctx: PIChamberGPIO) {
        super(ctx, TYPES.RQ_SHUTDOWN)
    }

    messageHandler(): void {
        exec('sudo shutdown -h now', err => {
            if (err) console.error('Shutdown failed:', err)
        })
    }
}
