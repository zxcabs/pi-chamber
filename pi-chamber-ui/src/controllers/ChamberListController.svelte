<script lang="ts">
    import HeatingChambers from '../ui/HeatingChambers/HeatingChambers.svelte'
    import type { TRequestDevice } from '../../../msg-schema/SetHeatingChamberDevicesValue'
    import { setDevicesValue } from '../actions/chambers'
    import { chambers as chambersStore } from '../store'
    import { startTask } from '../actions/sheduler'
    import type { TRequestPayload } from '../../../msg-schema/StartShedulerTask'

    function handleSetDevicesValue(devicesValue: TRequestDevice[]) {
        setDevicesValue(devicesValue)
    }

    function handleStarttask(data: TRequestPayload) {
        startTask(data)
    }
</script>

<HeatingChambers chambers={$chambersStore} onSetDevicesValue={handleSetDevicesValue} onStartTask={handleStarttask} />
