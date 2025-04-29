<script lang="ts">
    import '@carbon/charts/styles.css'
    import { ScaleTypes, StackedAreaChart, TickRotations, type StackedAreaChartOptions } from '@carbon/charts'
    import { onMount } from 'svelte'
    import ChartTooltip from './ChartTooltip'
    import { type ICharDataItem } from './Char'

    export let data: ICharDataItem[]

    let rootRef: HTMLDivElement
    let char: StackedAreaChart

    const now = Date.now()

    const options: StackedAreaChartOptions = {
        title: 'Timeline',

        axes: {
            left: {
                mapsTo: 'value',
                stacked: true,
            },
            bottom: {
                mapsTo: 'date',
                scaleType: ScaleTypes.TIME,
                ticks: {
                    min: 1,

                    number: 5, // Количество делений
                    rotation: TickRotations.NEVER,
                },
            },
        },

        curve: 'curveMonotoneX',
        height: '350px',
        theme: 'g90',
        legend: {
            clickable: true,
        },
        toolbar: {
            enabled: true,
            numberOfIcons: 2,
            controls: [
                {
                    type: 'Make fullscreen',
                },
            ],
        },
        tooltip: {
            customHTML: ChartTooltip,
        },
    }

    onMount(() => {
        char = new StackedAreaChart(rootRef, {
            data,
            options,
        })
    })

    $: if (char && data) {
        char.model.setData(data)
    }
</script>

<div bind:this={rootRef}></div>
