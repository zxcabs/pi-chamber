<script lang="ts">
    import { get } from 'svelte/store'
    import type { TDevice, TDeviceStore } from '../../stores/device'
    import Device from './Device.svelte'

    interface Props {
        devices: TDeviceStore[]
        onclick: ((device: TDevice) => void) | undefined
    }

    const { devices, onclick }: Props = $props()

    const keys = $derived(
        devices?.map(deviceStore => {
            const { name, type } = get(deviceStore)
            return `${name}_${type}`
        }),
    )
</script>

<div>
    <h2>Devices:</h2>

    <div class="devices">
        {#each devices as device, index (keys[index])}
            <Device {device} {onclick} />
        {/each}
    </div>
</div>

<style>
    .devices {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }
</style>
