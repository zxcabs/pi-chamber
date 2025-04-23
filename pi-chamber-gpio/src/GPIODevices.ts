import type { TGPIODevicesConfig } from '../../config-reader/readConfig.types.ts'
import type { IGPIODevice, IGPIODeviceResult, TGPIOValue } from './devices/types/IGPIODevice.type.ts'
import { GPIODevice } from './devices/GPIODevice.ts'
import { BaseDevices } from './BaseDevices.ts'

export default class GPIODevices extends BaseDevices<TGPIODevicesConfig, IGPIODevice, TGPIOValue, IGPIODeviceResult> {
    constructor(config: TGPIODevicesConfig) {
        super(config)
        this.devices = config.map(config => new GPIODevice(config))
    }
}
