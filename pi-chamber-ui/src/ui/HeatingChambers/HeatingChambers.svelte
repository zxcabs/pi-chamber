<script lang="ts">
    import type { TChamber } from 'src/stores/chambers'
    import Chamber from './HeatingChamber.svelte'

    export let chambers: TChamber[]
</script>

<div>
    <h2>Heating chambers:</h2>

    <div class="list">
        {#each chambers as chamber (`${chamber.config.name}`)}
            <Chamber {chamber} />
        {/each}
    </div>
</div>

<style>
    .list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }
</style>
