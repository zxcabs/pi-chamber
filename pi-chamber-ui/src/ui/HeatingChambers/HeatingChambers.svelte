<script lang="ts">
    import { ContentSwitcher, Switch } from 'carbon-components-svelte'
    import type { TChamber } from 'src/stores/chambers'
    import Chamber from './HeatingChamber.svelte'

    export let chambers: TChamber[]
    export let onSetDevicesValue: () => void

    let selectedIndex = 0

    $: currentChamber = chambers?.length && chambers[selectedIndex]

    function handleSetLightValue(data) {
        if (onSetDevicesValue) {
            onSetDevicesValue([
                {
                    name: data.name,
                    lightValue: data.value,
                },
            ])
        }
    }

    function handleSetFanValue(data) {
        if (onSetDevicesValue) {
            onSetDevicesValue([
                {
                    name: data.name,
                    fanValue: data.value,
                },
            ])
        }
    }
</script>

<div>
    <ContentSwitcher bind:selectedIndex>
        {#each chambers as chamber (`${chamber.config.name}`)}
            <Switch text={chamber.config.name}></Switch>
        {/each}
    </ContentSwitcher>

    {#if currentChamber}
        <Chamber chamber={currentChamber} onSetLightValue={handleSetLightValue} onSetFantValue={handleSetFanValue} />
    {/if}
</div>
