<script lang="ts">
    import Devices from '../ui/Deviсes/Devices.svelte'
    import { devices } from '../stores/devices'
    import type { TBaseDevice } from '../../../msg-schema/DeviceStatus'
    import { EDeviceTypes } from '../../../pi-chamber-gpio/src/devices/types/IBaseDeviceResult.types'
    import { setPWM, toggleDevice } from '../actions/devices'

    const handleClickDevice = (device: TBaseDevice) => {
        if (device.type === EDeviceTypes.GPIO) {
            toggleDevice(device)
        }
        if (device.type === EDeviceTypes.PWM) {
            const nextValue = device.value + 10

            setPWM(device, nextValue > 100 ? 0 : nextValue)
        }
    }
</script>

<div>
    <Devices devices={$devices} onclick={handleClickDevice} />
</div>
