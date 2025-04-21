import type { BinaryValue } from 'onoff'
import type { TGPIODevicesConfig } from '../../utils/readConfig.ts'
import type { IGPIODevice, IGPIODeviceResult } from './devices/IGPIODevice.type.ts'
import { GPIODevice } from './devices/GPIODevice.ts'

export class GPIODevices {
    private devices: Array<IGPIODevice>

    constructor(config: TGPIODevicesConfig) {
        this.devices = config.map(config => new GPIODevice(config))
    }

    async connect(): Promise<void> {
        await Promise.all(this.devices?.map(light => light.connect()))
    }

    find(name: string): IGPIODevice {
        return this.devices.find(i => i.name === name)
    }

    async read(name: string): Promise<IGPIODeviceResult> {
        const device = this.find(name)

        if (!device) {
            throw new Error(`Device ${name} not found`)
        }

        return await device.read()
    }

    async write(name: string, value: BinaryValue): Promise<IGPIODeviceResult> {
        const device = this.find(name)

        if (!device) {
            throw new Error(`Device ${name} not found`)
        }

        return await device.write(value)
    }

    async readAll(): Promise<Array<IGPIODeviceResult>> {
        return await Promise.all(this.devices.map(i => i.read()))
    }

    async writeAll(value: BinaryValue): Promise<Array<IGPIODeviceResult>> {
        return await Promise.all(this.devices.map(i => i.write(value)))
    }

    async release(): Promise<void> {
        await Promise.all(this.devices.map(i => i.release()))
    }
}
