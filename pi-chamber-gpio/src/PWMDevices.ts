import type { TPWMDevicesConfig } from '../../config-reader/readConfig.ts'
import { BaseDevices } from './BaseDevices.ts'
import type { IPWMDevice, IPWMDeviceResult, TPWMValue } from './devices/types/IPWMDevice.type.ts'
import { PWMDevice } from './devices/PWMDevice.ts'

export class PWMDevices extends BaseDevices<TPWMDevicesConfig, IPWMDevice, TPWMValue, IPWMDeviceResult> {
    constructor(config: TPWMDevicesConfig) {
        super()
        this.devices = config.map(config => new PWMDevice(config))
    }
}
