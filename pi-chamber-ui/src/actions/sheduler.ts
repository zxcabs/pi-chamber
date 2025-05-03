import { createRequestMessage, type TRequestPayload } from '../../../msg-schema/StartShedulerTask'
import WS from '../WS'

const ws = WS.getInstance()

export function startTask(data: TRequestPayload) {
    ws.send(createRequestMessage(data))
}
