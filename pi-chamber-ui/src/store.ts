import createStore from './stores/app'

const appStore = createStore()

export const { devices, chambers } = appStore

export default appStore
