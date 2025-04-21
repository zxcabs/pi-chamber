import { type TConfig } from '../../utils/readConfig.ts'
import TemperatureSensors from './TemperatureSensors.ts'
import PIChamberGPIOServer from './PIChamberGPIOServer.ts'
import { GPIODevices } from './GPIODevices.ts'
import type { BaseApiHandler } from './api/BaseApiHandler.ts'
import PingHandler from './api/PingHandler.ts'
import StatusHandler from './api/StatusHandler.ts'
import ToggleGPIODeviceHandler from './api/ToggleGPIODeviceHandler.ts'
import ShutdownHandler from './api/ShutdownHandler.ts'

class PIChamberGPIO {
    config: TConfig
    server: PIChamberGPIOServer
    temperatureSensors: TemperatureSensors
    gpioDevices: GPIODevices
    apiHandlers: BaseApiHandler[]

    constructor(config: TConfig) {
        this.config = config
        this.server = new PIChamberGPIOServer(config.general)
        this.temperatureSensors = new TemperatureSensors(config.temperature_sensors)
        this.gpioDevices = new GPIODevices(config.gpio_devices)
    }

    async start() {
        await this.server.start()
        await this.temperatureSensors.connect()
        await this.gpioDevices.connect()

        this.apiHandlers = [
            new PingHandler(this),
            new StatusHandler(this),
            new ToggleGPIODeviceHandler(this),
            new ShutdownHandler(this),
        ]

        this.server.on('error', error => {
            console.error(error)
        })
    }

    async stop() {
        this.apiHandlers.forEach(i => i.destroy())
        await this.server.stop()
        await this.temperatureSensors.release()
        await this.gpioDevices.release()
    }
}

export default PIChamberGPIO
