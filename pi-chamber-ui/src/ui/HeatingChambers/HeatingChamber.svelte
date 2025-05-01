<script lang="ts">
    import type { TChamberStore } from 'src/stores/chamber'
    import { Grid, Row, Column, Tile } from 'carbon-components-svelte'
    import type { TRequestDevice } from '../../../../msg-schema/SetHeatingChamberDevicesValue'
    import HeatingChamberChart from './HeatingChamberChart.svelte'
    import HeatingChamerParams from './HeatingChamerParams.svelte'

    interface Props {
        chamber: TChamberStore
        onSetDevicesValue: (deviceValue: TRequestDevice[]) => void
        onStartTask?: () => void
    }

    const { chamber, onSetDevicesValue, onStartTask }: Props = $props()

    const chart = chamber.chart
</script>

<Tile>
    <Grid>
        <Row>
            <Column>
                <HeatingChamberChart {chart} />
            </Column>
            <Column>
                <HeatingChamerParams chamber={$chamber} {onSetDevicesValue} {onStartTask} />
            </Column>
        </Row>
    </Grid>
</Tile>
