import { mount } from 'svelte'
import App from './App.svelte'
import WS from './WS'
import { createRequestStatusMessage } from '../../msg-schema/StatusMessage'
import { getHeatingChambers } from './actions/chambers'
import appStore from './store'
;(async () => {
    const ws = WS.getInstance()
    await ws.connect()

    ws.registerStoreHandler(appStore.handleMessage)
    ws.send(createRequestStatusMessage())

    getHeatingChambers()

    const app = mount(App, {
        target: document.getElementById('app')!,
    })
})()
