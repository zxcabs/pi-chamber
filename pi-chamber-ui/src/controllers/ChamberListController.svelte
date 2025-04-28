<script lang="ts">
    import HeatingChambers from '../ui/HeatingChambers/HeatingChambers.svelte'
    import { chambers } from '../stores/chambers'

    function handleSetDevicesValue(value) {
        console.log(value)
    }
</script>

<HeatingChambers chambers={$chambers} onSetDevicesValue={handleSetDevicesValue} />
