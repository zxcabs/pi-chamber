<script lang="ts">
    import Devices from '../ui/Deviсes/Devices.svelte'
    import { devices } from '../stores/devices'
    import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
    import { EDeviceTypes } from '../../../pi-chamber-gpio/src/devices/IBaseDeviceResult.types'

    const handleClickDevice = (device: TBaseDevice) => {
        if (device.type != EDeviceTypes.Light) {
            return
        }

        console.log(device)
    }
</script>

<div>
    <Devices devices={$devices} onclick={handleClickDevice} />
</div>
