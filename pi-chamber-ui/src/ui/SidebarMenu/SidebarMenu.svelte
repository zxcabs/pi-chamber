<script lang="ts">
    const menuItems = [
        { title: 'Главная', icon: '🏠', link: '/' },
        { title: 'Настройки', icon: '⚙️', link: '/settings' },
    ]
</script>

<ul class="menu">
    {#each menuItems as item}
        <li>
            <a href={item.link} class="menu-item">
                <span class="icon">{item.icon}</span>
                <span>{item.title}</span>
            </a>
        </li>
    {/each}
</ul>

<style>
    .menu {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 6px;
        color: #333;
        text-decoration: none;
    }

    .menu-item:hover {
        background: #e0e0e0;
    }

    .icon {
        font-size: 1.25rem;
    }
</style>
