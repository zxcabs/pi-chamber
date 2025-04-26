import { createRequestShutdownMessage } from '../../../msg-schema/ShutdownMessage'
import WS from '../WS'

export function shutdown() {
    WS.getInstance().send(createRequestShutdownMessage())
}
