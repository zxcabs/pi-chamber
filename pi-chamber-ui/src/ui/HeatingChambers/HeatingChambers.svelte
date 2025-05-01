<script lang="ts">
    import { Column, ContentSwitcher, Grid, Row, Switch } from 'carbon-components-svelte'
    import type { TChamberStore } from 'src/stores/chamber'
    import Chamber from './HeatingChamber.svelte'
    import type { TRequestDevice } from '../../../../msg-schema/SetHeatingChamberDevicesValue'
    import { get } from 'svelte/store'

    interface Props {
        chambers: TChamberStore[]
        onSetDevicesValue: (devicesValue: TRequestDevice[]) => void
        onStartTask?: () => void
    }

    const { chambers = [], onSetDevicesValue, onStartTask }: Props = $props()

    const selectedIndex = $state(0)
    const currentChamber = $derived(chambers[selectedIndex])
    const isShowSwitcher = $derived(chambers.length > 1)
</script>

<Grid noGutter>
    {#if isShowSwitcher}
        <Row>
            <Column>
                <ContentSwitcher {selectedIndex}>
                    {#each chambers as chamber (`${chamber.name}`)}
                        <Switch text={chamber.name}></Switch>
                    {/each}
                </ContentSwitcher>
            </Column>
        </Row>
    {/if}
    <Row>
        <Column>
            {#if currentChamber}
                <Chamber chamber={currentChamber} {onSetDevicesValue} {onStartTask} />
            {/if}
        </Column>
    </Row>
</Grid>
