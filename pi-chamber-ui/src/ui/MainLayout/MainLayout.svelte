<script lang="ts">
    import { Content, Grid, Row, Column } from 'carbon-components-svelte'
    import Header from '../Header/Header.svelte'

    export let onreload
    export let onshutdown
    export let onnavigate

    let isSideNavOpen: boolean
</script>

<Header {onreload} {onshutdown} bind:isSideNavOpen />

<Content>
    <Grid>
        <Row>
            <Column>
                <slot />
            </Column>
        </Row>
    </Grid>
</Content>
