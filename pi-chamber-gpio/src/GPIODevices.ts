import type { TGPIODevicesConfig } from '../../config-reader/readConfig.ts'
import type { IGPIODevice, IGPIODeviceResult, TGPIOValue } from './devices/types/IGPIODevice.type.ts'
import { GPIODevice } from './devices/GPIODevice.ts'
import { BaseDevices } from './BaseDevices.ts'

export class GPIODevices extends BaseDevices<TGPIODevicesConfig, IGPIODevice, TGPIOValue, IGPIODeviceResult> {
    constructor(config: TGPIODevicesConfig) {
        super()
        this.devices = config.map(config => new GPIODevice(config))
    }
}
