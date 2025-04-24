import WS from '../WS'
import { createRqHeatingChambersMessage } from '../../../msg-schema/HeatingChamberMessage'

const ws = WS.getInstance()

export function getHeatingChambers() {
    ws.send(createRqHeatingChambersMessage())
}
