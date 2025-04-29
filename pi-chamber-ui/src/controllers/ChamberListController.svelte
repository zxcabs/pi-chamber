<script lang="ts">
    import HeatingChambers from '../ui/HeatingChambers/HeatingChambers.svelte'
    import { chambers } from '../stores/chambers'
    import type { TRequestDevice } from '../../../msg-schema/SetHeatingChamberDevicesValue'
    import { setDevicesValue } from '../actions/chambers'

    function handleSetDevicesValue(devicesValue: TRequestDevice[]) {
        setDevicesValue(devicesValue)
    }
</script>

<HeatingChambers chambers={$chambers} onSetDevicesValue={handleSetDevicesValue} />
