import WS from '../WS'
import { createRequestHeatingChambersMessage } from '../../../msg-schema/HeatingChamberMessage'

const ws = WS.getInstance()

export function getHeatingChambers() {
    ws.send(createRequestHeatingChambersMessage())
}
