<script lang="ts">
    import MainLayout from './ui/MainLayout/MainLayout.svelte'
    import CurrentTemp from './lib/CurrentTemp.svelte'
</script>

<MainLayout onreload={() => window.location.reload()}>
    <CurrentTemp />
</MainLayout>

<style>
</style>
