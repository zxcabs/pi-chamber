import WS from '../WS'
import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
import { createRqToggleGPIODeviceMessage } from '../../../msg-schema/ToggleGPIODeviceMessage'

const ws = WS.getInstance()

export function toggleDevice(device: TBaseDevice) {
    ws.send(createRqToggleGPIODeviceMessage({ name: device.name }))
}
