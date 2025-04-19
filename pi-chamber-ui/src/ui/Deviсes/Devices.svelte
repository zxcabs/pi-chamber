<script lang="ts">
    import type { TBaseDevice } from '../../../../msg-schema/DeviceStatus.ts'
    import Device from './Device.svelte'

    export let devices: TBaseDevice[] = []
    export let onclick: ((device: TBaseDevice) => void) | undefined = undefined
</script>

<div class="devices">
    {#each devices as device (`${device.type}_${device.name}`)}
        <Device {device} {onclick} />
    {/each}
</div>

<style>
    .devices {
        display: flex;
        gap: 20px;
    }
</style>
