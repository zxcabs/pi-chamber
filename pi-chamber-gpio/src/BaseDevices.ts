import type { IDeviceBase } from './devices/types/IBaseDeviceResult.types.ts'

export class BaseDevices<
    TDevicesConfig,
    TDevice extends IDeviceBase<TDeviceValue, TDeviceResult>,
    TDeviceValue,
    TDeviceResult,
> {
    protected devices: TDevice[] = []

    constructor(private config: TDevicesConfig) {}

    async connect(): Promise<void> {
        await Promise.all(this.devices?.map(device => device.connect()))
    }

    find(name: string): TDevice | undefined {
        return this.devices.find(i => i.name === name)
    }

    async read(name: string): Promise<TDeviceResult> {
        const device = this.find(name)

        if (!device) {
            throw new Error(`Device ${name} not found`)
        }

        return await device.read()
    }

    async write(name: string, value: TDeviceValue): Promise<TDeviceResult> {
        const device = this.find(name)

        if (!device) {
            throw new Error(`Device ${name} not found`)
        }

        return await device.write(value)
    }

    async readAll(): Promise<Array<TDeviceResult>> {
        return await Promise.all(this.devices.map(i => i.read()))
    }

    async writeAll(value: TDeviceValue): Promise<TDeviceResult[]> {
        return await Promise.all(this.devices.map(i => i.write(value)))
    }

    async writeByNames(devices: { name: string; value: TDeviceValue }[] = []): Promise<TDeviceResult[]> {
        return await Promise.all(devices.map(device => this.write(device.name, device.value)))
    }

    async release(): Promise<void> {
        await Promise.all(this.devices.map(i => i.release()))
    }
}
