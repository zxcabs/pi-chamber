import { type TConfig } from '../../config-reader/readConfig.types.ts'
import TemperatureSensors from './TemperatureSensors.ts'
import PIChamberGPIOServer from './PIChamberGPIOServer.ts'
import GPIODevices from './GPIODevices.ts'
import PWMDevices from './PWMDevices.ts'
import HeatingChambers from './HeatingChamber/HeatingChambers.ts'
import APIHandler from './APIHandler.ts'

class PIChamberGPIO {
    config: TConfig
    server: PIChamberGPIOServer
    temperatureSensors: TemperatureSensors
    gpioDevices: GPIODevices
    pwmDevices: PWMDevices
    heatingChambers: HeatingChambers
    apiHandler: APIHandler

    constructor(config: TConfig) {
        this.config = config
        this.server = new PIChamberGPIOServer(config.general)
        this.temperatureSensors = new TemperatureSensors(config.temperature_sensors)
        this.gpioDevices = new GPIODevices(config.gpio_devices)
        this.pwmDevices = new PWMDevices(config.pwm_devices)
        this.heatingChambers = new HeatingChambers(config.heating_chambers)
        this.apiHandler = new APIHandler(this)
    }

    async start() {
        await this.server.start()
        await this.temperatureSensors.connect()
        await this.gpioDevices.connect()
        await this.pwmDevices.connect()
        await this.heatingChambers.connect()
        await this.apiHandler.connect()

        this.server.on('error', error => {
            console.error(error)
        })
    }

    async stop() {
        await this.apiHandler.release()
        await this.server.stop()
        await this.heatingChambers.release()
        await this.temperatureSensors.release()
        await this.gpioDevices.release()
        await this.pwmDevices.release()
    }
}

export default PIChamberGPIO
