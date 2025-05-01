<script lang="ts">
    import { Column, ContentSwitcher, Grid, Row, Switch } from 'carbon-components-svelte'
    import type { TChamberStore } from 'src/stores/chamber'
    import Chamber from './HeatingChamber.svelte'
    import type { TRequestDevice } from '../../../../msg-schema/SetHeatingChamberDevicesValue'
    import { get } from 'svelte/store'

    interface Props {
        chambers: TChamberStore[]
        onSetDevicesValue: (devicesValue: TRequestDevice[]) => void
    }

    const { chambers = [], onSetDevicesValue }: Props = $props()

    const selectedIndex = $state(0)
    const currentChamber = $derived(chambers[selectedIndex])
    const isShowSwitcher = $derived(chambers.length > 1)
    const chamberNames = $derived(chambers.map(chamberStore => get(chamberStore).config.name))
</script>

<Grid noGutter>
    {#if isShowSwitcher}
        <Row>
            <Column>
                <ContentSwitcher {selectedIndex}>
                    {#each chamberNames as name (`${name}`)}
                        <Switch text={name}></Switch>
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
