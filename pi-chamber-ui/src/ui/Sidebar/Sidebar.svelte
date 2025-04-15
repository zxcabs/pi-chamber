<script lang="ts">
    import SidebarMenu from '../SidebarMenu/SidebarMenu.svelte'
</script>

<aside class="sidebar">
    <nav><SidebarMenu /></nav>
</aside>

<style>
    .sidebar {
        background: #f5f5f5;
        border-right: 1px solid #ddd;
        min-height: calc(100vh - 60px);
    }
</style>
