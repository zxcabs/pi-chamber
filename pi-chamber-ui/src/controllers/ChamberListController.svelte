<script lang="ts">
    import HeatingChambers from '../ui/HeatingChambers/HeatingChambers.svelte'
    import { chambers } from '../stores/chambers'
</script>

<HeatingChambers chambers={$chambers} />
