<script lang="ts">
    import type { TChamber } from 'src/stores/chambers'

    export let chamber: TChamber

    const name = chamber.config.name

    function handleClick() {}

    function handleKeyup(e: KeyboardEvent) {}
</script>

<div
    on:click={handleClick}
    on:keyup={handleKeyup}
    role="button"
    tabindex="0"
    class="chamber"
    aria-label={`Chamber ${name || 'unknown'}`}
>
    <div>{name}</div>
    <div>{JSON.stringify(chamber.state, null, 2)}</div>
</div>

<style>
    .chamber {
        cursor: pointer;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin: 0.5rem 0;
        display: flex;
        width: 300px;
        height: 300px;
        flex-direction: column;
    }

    .chamber:focus {
        outline: 2px solid #3b82f6;
    }
</style>
