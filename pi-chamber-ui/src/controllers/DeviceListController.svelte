<script lang="ts">
    import Devices from '../ui/Deviсes/Devices.svelte'
    import { devices } from '../stores/devices'
    import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
    import { EDeviceTypes } from '../../../pi-chamber-gpio/src/devices/IBaseDeviceResult.types'
    import { toggleDevice } from '../actions/devices'

    const handleClickDevice = (device: TBaseDevice) => {
        if (device.type != EDeviceTypes.Gpio) {
            return
        }

        toggleDevice(device)
    }
</script>

<div>
    <Devices devices={$devices} onclick={handleClickDevice} />
</div>
