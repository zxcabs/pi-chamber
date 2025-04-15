<script lang="ts">
    import Sidebar from '../Sidebar/Sidebar.svelte'
    import Header from '../Header/Header.svelte'

    export let onreload
</script>

<div class="layout">
    <Header {onreload} />
    <div class="content-wrapper">
        <Sidebar />

        <main class="main-content">
            <slot />
        </main>
    </div>
</div>

<style>
    .layout {
        min-height: 100vh;
    }

    .content-wrapper {
        display: flex;
        padding-top: 60px;
    }

    .main-content {
        flex-grow: 1;
        padding: 20px;
        transition: margin 0.3s ease;
    }
</style>
