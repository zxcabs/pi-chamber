import type { TPWMDevicesConfig } from '../../config-reader/readConfig.types.ts'
import { BaseDevices } from './BaseDevices.ts'
import type { IPWMDevice, IPWMDeviceResult, TPWMValue } from './devices/types/IPWMDevice.type.ts'
import { PWMDevice } from './devices/PWMDevice.ts'

export default class PWMDevices extends BaseDevices<TPWMDevicesConfig, IPWMDevice, TPWMValue, IPWMDeviceResult> {
    constructor(config: TPWMDevicesConfig) {
        super(config)
        this.devices = config.map(config => new PWMDevice(config))
    }
}
