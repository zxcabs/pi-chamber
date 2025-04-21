<script lang="ts">
    import SidebarMenu from '../SidebarMenu/SidebarMenu.svelte'

    export let onnavigate
</script>

<aside class="sidebar">
    <nav><SidebarMenu {onnavigate} /></nav>
</aside>

<style>
    .sidebar {
        background: #f5f5f5;
        border-right: 1px solid #ddd;
        min-height: calc(100vh - 60px);
    }
</style>
