import { type TConfig } from '../../config-reader/readConfig.types.ts'
import TemperatureSensors from './TemperatureSensors.ts'
import PIChamberGPIOServer from './SocketServer/PIChamberGPIOServer.ts'
import GPIODevices from './GPIODevices.ts'
import PWMDevices from './PWMDevices.ts'
import HeatingChambers from './HeatingChamber/HeatingChambers.ts'
import APIHandler from './APIHandler.ts'
import EventBus from './EventBus.ts'
import { SocketServerEventBridge } from './SocketServer/SocketServerEventBridge.ts'

class PIChamberGPIO {
    config: TConfig
    ebus: EventBus
    server: PIChamberGPIOServer
    temperatureSensors: TemperatureSensors
    gpioDevices: GPIODevices
    pwmDevices: PWMDevices
    heatingChambers: HeatingChambers
    apiHandler: APIHandler

    private serverBridge: SocketServerEventBridge

    constructor(config: TConfig) {
        this.config = config
        this.ebus = new EventBus()
        this.server = new PIChamberGPIOServer(config.general)
        this.temperatureSensors = new TemperatureSensors(config.temperature_sensors)
        this.gpioDevices = new GPIODevices(config.gpio_devices)
        this.pwmDevices = new PWMDevices(config.pwm_devices)
        this.heatingChambers = new HeatingChambers(config.heating_chambers)
        this.apiHandler = new APIHandler(this)

        this.serverBridge = new SocketServerEventBridge(this.server, this.ebus)
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

        this.serverBridge.release()
        this.ebus.release()
    }
}

export default PIChamberGPIO
