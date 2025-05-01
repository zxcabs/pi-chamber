<script lang="ts">
    import type { TChamberChartStore } from 'src/stores/chamber'
    import Chart from '../Chart/Chart.svelte'

    interface Props {
        chart: TChamberChartStore
    }

    let { chart }: Props = $props()
</script>

<Chart {chart} />
