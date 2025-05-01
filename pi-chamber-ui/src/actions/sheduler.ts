import { createRequestMessage } from '../../../msg-schema/StartShedulerTask'
import WS from '../WS'

const ws = WS.getInstance()

export function startTask() {
    ws.send(createRequestMessage({}))
}
