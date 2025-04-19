import { mount } from 'svelte'
import 'modern-normalize/modern-normalize.css'
import './app.css'
import App from './App.svelte'
import WS from './WS'
import { appStore, handleMessage as appHandler } from './stores/app'
import { devices } from './stores/devices'

const ws = new WS()
ws.connect()

ws.registerStoreHandler(appHandler)

const app = mount(App, {
    target: document.getElementById('app')!,
    props: {
        appStore,
    },
})

export default app
