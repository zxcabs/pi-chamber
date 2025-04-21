<script lang="ts">
    import Icon from '@iconify/svelte'

    export let item
    export let onnavigate

    const handleNavigate = (e: Event) => {
        if (!onnavigate) return
        e.preventDefault()
        onnavigate({ path: item.link })
    }
</script>

<a href={item.link} class="menu-item" on:click={handleNavigate}>
    <Icon icon={item.icon} />
    <span>{item.title}</span>
</a>

<style>
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
</style>
