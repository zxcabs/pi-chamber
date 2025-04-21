<script lang="ts">
    import { navigate } from 'svelte-routing'
    import { shutdown } from '../actions/shutdown'
    import MainLayout from '../ui/MainLayout/MainLayout.svelte'

    const handleNavigate = ({ path }) => {
        navigate(path)
    }
</script>

<MainLayout onreload={() => window.location.reload()} onshutdown={() => shutdown()} onnavigate={handleNavigate}>
    <slot />
</MainLayout>

<style>
</style>
