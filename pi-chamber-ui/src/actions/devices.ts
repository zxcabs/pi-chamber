import WS from '../WS'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import { createRequestToggleGPIOMessage } from '../../../msg-schema/ToggleGPIODeviceMessage'
import { createRequestSetPWMMessage } from '../../../msg-schema/SetPWMDeviceMessage'
import type { TPWMValue } from '../../../pi-chamber-gpio/src/devices/types/IPWMDevice.type'

const ws = WS.getInstance()

export function toggleDevice(device: TBaseDevice) {
    ws.send(createRequestToggleGPIOMessage({ name: device.name }))
}

export function setPWM(device: TBaseDevice, value: TPWMValue) {
    ws.send(createRequestSetPWMMessage({ name: device.name, value }))
}
