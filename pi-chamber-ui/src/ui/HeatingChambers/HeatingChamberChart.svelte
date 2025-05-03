<script lang="ts">
    import type { TChamberChartStore } from 'src/stores/chamber'
    import { Chart, type ChartType, type TooltipItem } from 'chart.js/auto'
    import { onDestroy, onMount } from 'svelte'

    interface Props {
        chart: TChamberChartStore
    }

    const { chart }: Props = $props()

    let rootRef: HTMLCanvasElement
    let chartRef: Chart

    // Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Legend)

    const formatter = new Intl.DateTimeFormat('ru-RU', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    })

    const dataSet = {
        datasets: [
            {
                label: 'Текущая (°C)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: true,
                data: [],
            },
            {
                label: 'Целевая (°C)',
                borderColor: 'rgba(200, 110, 110, 1)',
                fill: true,
                data: [],
            },
        ],
    }

    const config = {
        type: 'line' as ChartType,
        data: dataSet,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: { display: true, text: 'Температура (°C)' },
                    min: 0,
                },
                x: {
                    ticks: {
                        maxRotation: 0,
                        callback: function (val: number | string, index: number) {
                            // @ts-ignore
                            const label: string = this.getLabelForValue(val)
                            return index % 10 === 0 ? formatter.format(Number(label)) : ''
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                },
                legend: {
                    position: 'bottom' as const,
                },
                tooltip: {
                    callbacks: {
                        label: function (context: TooltipItem<'line'>) {
                            return `${context.dataset.label}:  ${context.formattedValue}`
                        },
                        title: function (context: TooltipItem<'line'>[]) {
                            return context.map(t => `Время: ${formatter.format(Number(t.label))}`)
                        },
                    },
                },
            },
            elements: {
                point: {
                    radius: 1,
                },
            },
        },
    }

    const unsubChartUpdate = chart.subscribe(chartData => {
        if (chartRef) {
            const { labels, datasets } = chartData.reduce(
                (acc, item) => {
                    acc.labels.push(item.time)
                    acc.datasets[0].push(item.current_temperature)
                    acc.datasets[1].push(item.target_temperature)

                    return acc
                },
                {
                    labels: [] as number[],
                    datasets: [[] as number[], [] as number[]],
                },
            )

            chartRef.data.labels = labels
            chartRef.data.datasets[0].data = datasets[0]
            chartRef.data.datasets[1].data = datasets[1]
            chartRef.update('none')
        }
    })

    onMount(() => {
        chartRef = new Chart(rootRef, config)
    })

    onDestroy(() => {
        unsubChartUpdate()
    })
</script>

<canvas bind:this={rootRef} width="100%"></canvas>
