<script lang="ts">
    import { Router, Route } from 'svelte-routing'
    import MainPage from './pages/MainPage.svelte'
    import MainLayoutController from './controllers/MainLayoutController.svelte'
    import SettingsPage from './pages/SettingsPage.svelte'

    export let url = ''
</script>

<Router {url}>
    <MainLayoutController>
        <Route path="/settings"><SettingsPage /></Route>
        <Route path="/"><MainPage /></Route>
    </MainLayoutController>
</Router>
