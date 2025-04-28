<script lang="ts">
    import type { TChamber } from 'src/stores/chambers'
    import { Toggle, Grid, Row, Column } from 'carbon-components-svelte'

    export let chamber: TChamber
    export let onSetLightValue: ({ name, value }: { name: string; value: 0 | 1 }) => void
    export let onSetFantValue: ({ name, value }: { name: string; value: 0 | 1 }) => void

    const name = chamber.config.name

    $: lightStatus = chamber.state.light_status === 'ON'
    $: fanStatus = chamber.state.fan_status === 'ON'

    function handleLightChange(e: Event) {
        if (!onSetLightValue) return
        onSetLightValue({ name: name, value: lightStatus ? 1 : 0 })
    }

    function handleFanChange(e: Event) {
        if (!onSetFantValue) return
        onSetFantValue({ name: name, value: fanStatus ? 1 : 0 })
    }
</script>

<Grid>
    <Row>
        <Column>
            <div>
                <div>
                    <div>
                        <Toggle
                            bind:toggled={lightStatus}
                            labelText="Light"
                            labelA="OFF"
                            labelB="ON"
                            on:change={handleLightChange}
                        />
                    </div>
                    <div>
                        <Toggle
                            bind:toggled={fanStatus}
                            labelText="Fan"
                            labelA="OFF"
                            labelB="ON"
                            on:change={handleFanChange}
                        />
                    </div>
                </div>
            </div>
        </Column>
    </Row>
</Grid>
