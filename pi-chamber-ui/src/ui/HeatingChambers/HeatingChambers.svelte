<script lang="ts">
    import { Column, ContentSwitcher, Grid, Row, Switch } from 'carbon-components-svelte'
    import type { TChamber } from 'src/stores/chambers'
    import Chamber from './HeatingChamber.svelte'
    import type { TRequestDevice } from '../../../../msg-schema/SetHeatingChamberDevicesValue'

    export let chambers: TChamber[]
    export let onSetDevicesValue: (devicesValue: TRequestDevice[]) => void

    let selectedIndex = 0

    $: currentChamber = chambers?.length && chambers[selectedIndex]
    $: isShowSwitcher = chambers?.length > 1
</script>

<Grid noGutter>
    {#if isShowSwitcher}
        <Row>
            <Column>
                <ContentSwitcher bind:selectedIndex>
                    {#each chambers as chamber (`${chamber.config.name}`)}
                        <Switch text={chamber.config.name}></Switch>
                    {/each}
                </ContentSwitcher>
            </Column>
        </Row>
    {/if}
    <Row>
        <Column>
            {#if currentChamber}
                <Chamber chamber={currentChamber} {onSetDevicesValue} />
            {/if}
        </Column>
    </Row>
</Grid>
