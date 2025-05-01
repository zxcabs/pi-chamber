<script lang="ts">
    import { get } from 'svelte/store'
    import Devices from '../ui/Deviсes/Devices.svelte'
    import { EDeviceTypes } from '../../../pi-chamber-gpio/src/devices/types/IBaseDeviceResult.types'
    import { setPWM, toggleDevice, setGPOIdevives } from '../actions/devices'
    import type { TGPIOValue } from '../../../pi-chamber-gpio/src/devices/types/IGPIODevice.type'
    import { Button } from 'carbon-components-svelte'
    import { devices as devicesStore } from '../store'
    import type { TDevice } from '../stores/device'

    const handleClickDevice = (device: TDevice) => {
        if (device.type === EDeviceTypes.GPIO) {
            toggleDevice(device)
        }
        if (device.type === EDeviceTypes.PWM) {
            const nextValue = device.value + 10

            setPWM(device, nextValue > 100 ? 0 : nextValue)
        }
    }

    const handleClickToggleAllGPIO = () => {
        const gpioDevicesStore = get(devicesStore.gpioDevices)

        const gpioValues = gpioDevicesStore?.map(ledStore => {
            const led = get(ledStore)
            return {
                name: led.name,
                value: (led.value ^ 1) as TGPIOValue,
            }
        })

        setGPOIdevives(gpioValues)
    }
</script>

<div>
    <Devices devices={$devicesStore} onclick={handleClickDevice} />
    <Button on:click={handleClickToggleAllGPIO}>Toggle all GPIO</Button>
</div>
