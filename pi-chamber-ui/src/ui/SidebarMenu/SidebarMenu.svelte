<script lang="ts">
    import SidebarMenuItem from './SidebarMenuItem.svelte'

    const menuItems = [
        { title: 'Главная', icon: 'fluent:home-16-regular', link: '/' },
        { title: 'Настройки', icon: 'fluent:settings-16-regular', link: '/settings' },
    ]

    export let onnavigate
</script>

<ul class="menu">
    {#each menuItems as item}
        <li>
            <SidebarMenuItem {item} {onnavigate} />
        </li>
    {/each}
</ul>

<style>
    .menu {
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>
