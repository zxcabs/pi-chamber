<script lang="ts">
    import type { TBaseDevice } from '../../../../msg-schema/DeviceStatus.ts'
    import { EDeviceTypes } from '../../../../pi-chamber-gpio/src/devices/IBaseDeviceResult.types.js'

    const ICONS: Record<string, string> = {
        [EDeviceTypes.TemperatureSensor]: '🌡️',
        [EDeviceTypes.Light]: '💡',
    }

    export let device: TBaseDevice
    export let onclick: ((device: TBaseDevice) => void) | undefined = undefined

    function handleClick() {
        if (onclick) {
            onclick(device)
        }
    }

    function handleKeyup(e: KeyboardEvent) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            handleClick()
        }
    }
</script>

<div
    on:click={handleClick}
    on:keyup={handleKeyup}
    role="button"
    tabindex="0"
    class="device"
    aria-label={`Device ${device.name || 'unknown'}`}
>
    <div>{ICONS[device.type] || ''}</div>
    <div>{device.name}</div>
    <div>{device.value}</div>
</div>

<style>
    .device {
        cursor: pointer;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin: 0.5rem 0;
        display: flex;
        width: 100px;
        height: 100px;
        flex-direction: column;
    }

    .device:focus {
        outline: 2px solid #3b82f6;
    }
</style>
