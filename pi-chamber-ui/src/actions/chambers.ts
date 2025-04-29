import WS from '../WS'
import { createRequestHeatingChambersMessage } from '../../../msg-schema/HeatingChamberMessage'
import {
    createRequestMessage as createRequestSetDevicesValueMessage,
    type TRequestDevice,
} from '../../../msg-schema/SetHeatingChamberDevicesValue'

const ws = WS.getInstance()

export function getHeatingChambers() {
    ws.send(createRequestHeatingChambersMessage())
}

export function setDevicesValue(devicesValue: TRequestDevice[]) {
    ws.send(
        createRequestSetDevicesValueMessage({
            devices: devicesValue,
        }),
    )
}
