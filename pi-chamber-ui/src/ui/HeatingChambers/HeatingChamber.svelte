<script lang="ts">
    import type { TChamberStore } from 'src/stores/chamber'
    import { Grid, Row, Column, Tile } from 'carbon-components-svelte'
    import type { TRequestDevice } from '../../../../msg-schema/SetHeatingChamberDevicesValue'
    import HeatingChamberChart from './HeatingChamberChart.svelte'
    import HeatingChamerParams from './HeatingChamerParams.svelte'

    interface Props {
        chamber: TChamberStore
        onSetDevicesValue: (deviceValue: TRequestDevice[]) => void
    }

    const { chamber, onSetDevicesValue }: Props = $props()

    const chart = chamber.chart
</script>

<Tile>
    <Grid>
        <Row>
            <Column aspectRatio="2x1">
                <HeatingChamberChart {chart} />
            </Column>
            <Column aspectRatio="2x1">
                <HeatingChamerParams chamber={$chamber} {onSetDevicesValue} />
            </Column>
        </Row>
    </Grid>
</Tile>
