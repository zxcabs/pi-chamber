import { type TConfig } from '../../config-reader/readConfig.ts'
import TemperatureSensors from './TemperatureSensors.ts'
import PIChamberGPIOServer from './PIChamberGPIOServer.ts'
import { GPIODevices } from './GPIODevices.ts'
import type { BaseApiHandler } from './api/BaseApiHandler.ts'
import PingHandler from './api/PingHandler.ts'
import StatusHandler from './api/StatusHandler.ts'
import ToggleGPIODeviceHandler from './api/ToggleGPIODeviceHandler.ts'
import ShutdownHandler from './api/ShutdownHandler.ts'
import { PWMDevices } from './PWMDevices.ts'
import SetPWMHandler from './api/SetPWMHandler.ts'

class PIChamberGPIO {
    config: TConfig
    server: PIChamberGPIOServer
    temperatureSensors: TemperatureSensors
    gpioDevices: GPIODevices
    pwmDevices: PWMDevices
    apiHandlers: BaseApiHandler[]

    constructor(config: TConfig) {
        this.config = config
        this.server = new PIChamberGPIOServer(config.general)
        this.temperatureSensors = new TemperatureSensors(config.temperature_sensors)
        this.gpioDevices = new GPIODevices(config.gpio_devices)
        this.pwmDevices = new PWMDevices(config.pwm_devices)
    }

    async start() {
        await this.server.start()
        await this.temperatureSensors.connect()
        await this.gpioDevices.connect()
        await this.pwmDevices.connect()

        this.apiHandlers = [
            new PingHandler(this),
            new StatusHandler(this),
            new ToggleGPIODeviceHandler(this),
            new ShutdownHandler(this),
            new SetPWMHandler(this),
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
        await this.pwmDevices.release()
    }
}

export default PIChamberGPIO
