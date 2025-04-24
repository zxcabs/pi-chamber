<script lang="ts">
    import type { TBaseDevice } from '../../../../msg-schema/DeviceStatus.ts'
    import Device from './Device.svelte'

    export let devices: TBaseDevice[] = []
    export let onclick: ((device: TBaseDevice) => void) | undefined = undefined
</script>

<div>
    <h2>Devices:</h2>

    <div class="devices">
        {#each devices as device (`${device.type}_${device.name}`)}
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
