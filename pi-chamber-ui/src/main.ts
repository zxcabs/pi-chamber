import { mount } from 'svelte'
import 'modern-normalize/modern-normalize.css'
import './app.css'
import App from './App.svelte'
import WS from './WS'
import { handleMessage as appHandler } from './stores/app'
import { createRqStatusMessage } from '../../msg-schema/StatusMessage'
import { getHeatingChambers } from './actions/chambers'

;(async () => {
    const ws = WS.getInstance()
    await ws.connect()

    ws.registerStoreHandler(appHandler)
    ws.send(createRqStatusMessage())
    getHeatingChambers()

    const app = mount(App, {
        target: document.getElementById('app')!,
    })
})()
