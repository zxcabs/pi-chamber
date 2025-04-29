<script lang="ts">
    import type { TChamber } from 'src/stores/chambers'
    import { Grid, Row, Column, Tile } from 'carbon-components-svelte'
    import type { TRequestDevice } from '../../../../msg-schema/SetHeatingChamberDevicesValue'
    import Chart from '../Chart/Chart.svelte'
    import HeatingChamerParams from './HeatingChamerParams.svelte'

    export let chamber: TChamber
    export let onSetDevicesValue: (deviceValue: TRequestDevice[]) => void

    const now = Date.now()

    const charData = new Array(26).fill(0).map((val, i, arr) => ({
        group: i >= 13 ? 'Current temp' : 'Target temp',
        date: i >= 13 ? now + (i - 13) * 5000 : now + i * 5000,
        value: Math.random() * 200,
    }))
</script>

<Tile>
    <Grid>
        <Row>
            <Column aspectRatio="2x1">
                <Chart data={charData} />
            </Column>
            <Column aspectRatio="2x1">
                <HeatingChamerParams {chamber} {onSetDevicesValue} />
            </Column>
        </Row>
    </Grid>
</Tile>
