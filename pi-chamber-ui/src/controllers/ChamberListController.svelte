<script lang="ts">
    import HeatingChambers from '../ui/HeatingChambers/HeatingChambers.svelte'
    import type { TRequestDevice } from '../../../msg-schema/SetHeatingChamberDevicesValue'
    import { setDevicesValue } from '../actions/chambers'
    import { chambers as chambersStore } from '../store'

    function handleSetDevicesValue(devicesValue: TRequestDevice[]) {
        setDevicesValue(devicesValue)
    }
</script>

<HeatingChambers chambers={$chambersStore} onSetDevicesValue={handleSetDevicesValue} />
