import WS from '../WS'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import { createRqToggleGPIODeviceMessage } from '../../../msg-schema/ToggleGPIODeviceMessage'
import { createRqSetPWMMessage } from '../../../msg-schema/PWMDeviceMessage'
import type { TPWMValue } from '../../../pi-chamber-gpio/src/devices/types/IPWMDevice.type'

const ws = WS.getInstance()

export function toggleDevice(device: TBaseDevice) {
    ws.send(createRqToggleGPIODeviceMessage({ name: device.name }))
}

export function setPWM(device: TBaseDevice, value: TPWMValue) {
    ws.send(createRqSetPWMMessage({ name: device.name, value }))
}
