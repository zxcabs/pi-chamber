<script lang="ts">
    import { Chart, elements } from 'chart.js/auto'
    import { onDestroy, onMount } from 'svelte'
    import type { TChartStore } from 'src/stores/chart'

    interface Props {
        chart: TChartStore
    }

    const { chart }: Props = $props()

    let rootRef: HTMLCanvasElement
    let chartRef: Chart

    // Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Legend)

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
            {
                label: 'Нагреватель',
                borderColor: 'rgba(50, 255, 110, 1)',
                fill: true,
                data: [],
            },
        ],
    }

    const formatter = new Intl.DateTimeFormat('ru-RU', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    })

    const config = {
        type: 'line',
        data: dataSet,
        options: {
            // responsive: true,
            scales: {
                y: {
                    title: { display: true, text: 'Температура (°C)' },
                    min: 0,
                },
                x: {
                    ticks: {
                        maxRotation: 0,
                        callback: function (val, index) {
                            return index % 5 === 0 ? formatter.format(this.getLabelForValue(val)) : ''
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                },
                legend: {
                    position: 'bottom',
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
                    acc.datasets[2].push(item.heaterValue)

                    return acc
                },
                {
                    labels: [],
                    datasets: [[], [], []],
                },
            )

            chartRef.data.labels = labels
            chartRef.data.datasets[0].data = datasets[0]
            chartRef.data.datasets[1].data = datasets[1]
            chartRef.data.datasets[2].data = datasets[2]
            chartRef.update()
        }
    })

    onMount(() => {
        chartRef = new Chart(rootRef, config)
    })

    onDestroy(() => {
        unsubChartUpdate()
    })
</script>

<canvas bind:this={rootRef} width="100%" height="300px"></canvas>
