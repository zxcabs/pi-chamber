import type PIChamberGPIO from './PIChamberGPIO.ts'
import type { BaseApiHandler } from './api/BaseApiHandler.ts'
import PingHandler from './api/PingHandler.ts'
import StatusHandler from './api/StatusHandler.ts'
import ToggleGPIODeviceHandler from './api/ToggleGPIODeviceHandler.ts'
import ShutdownHandler from './api/ShutdownHandler.ts'
import SetPWMHandler from './api/SetPWMHandler.ts'
import HeatingChambersHandler from './api/HeatingChambersHandler.ts'

export default class APIHandler {
    private apiHandlers: BaseApiHandler[]
    constructor(private ctx: PIChamberGPIO) {}

    async connect() {
        this.apiHandlers = [
            new PingHandler(this.ctx),
            new StatusHandler(this.ctx),
            new ToggleGPIODeviceHandler(this.ctx),
            new ShutdownHandler(this.ctx),
            new SetPWMHandler(this.ctx),
            new HeatingChambersHandler(this.ctx),
        ]
    }

    async release() {
        this.apiHandlers.forEach(i => i.destroy())
    }
}
