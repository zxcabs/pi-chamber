<script lang="ts">
    import DeviceList from './lib/DeviceList.svelte'
    import type { TAppStore } from './stores/app'
    import MainLayout from './ui/MainLayout/MainLayout.svelte'

    export let appStore: TAppStore
</script>

<MainLayout onreload={() => window.location.reload()}>
    <DeviceList />
</MainLayout>

<style>
</style>
