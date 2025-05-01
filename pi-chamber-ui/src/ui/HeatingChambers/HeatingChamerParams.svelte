<script lang="ts">
    import type { TChamber } from 'src/stores/chamber'
    import type { TRequestDevice } from '../../../../msg-schema/SetHeatingChamberDevicesValue'
    import {
        HEATING_CHAMBER_DEVICE_FAN,
        HEATING_CHAMBER_DEVICE_LIGHT,
    } from '../../../../msg-schema/schemas/HeatingChamberState'
    import { Toggle, Grid, Row, Column, Button, ButtonSet } from 'carbon-components-svelte'
    import IconTemperature from '../Icons/IconTemperature.svelte'

    export let chamber: TChamber
    export let onSetDevicesValue: (deviceValue: TRequestDevice[]) => void

    const chamberName = chamber.config.name

    $: lightStatus = chamber.state.light_status === 'ON'
    $: fanStatus = chamber.state.fan_status === 'ON'

    function handleLightChange(e: Event) {
        if (!onSetDevicesValue) return
        onSetDevicesValue([{ chamber: chamberName, name: HEATING_CHAMBER_DEVICE_LIGHT, value: lightStatus ? 1 : 0 }])
    }

    function handleFanChange(e: Event) {
        if (!onSetDevicesValue) return
        onSetDevicesValue([{ chamber: chamberName, name: HEATING_CHAMBER_DEVICE_FAN, value: fanStatus ? 1 : 0 }])
    }
</script>

<Grid>
    <Row padding>
        <Column>
            Current <IconTemperature />: {chamber.state.current_temperature}
        </Column>
        <Column>
            Target <IconTemperature />: {chamber.state.target_temperature}
        </Column>
        <Column>
            Current heating power: {chamber.state.heaterValue}%
        </Column>
    </Row>
    <Row padding>
        <Column>
            <Toggle
                bind:toggled={lightStatus}
                labelText="Light"
                labelA="OFF"
                labelB="ON"
                on:change={handleLightChange}
            />
        </Column>
        <Column>
            <Toggle bind:toggled={fanStatus} labelText="Fan" labelA="OFF" labelB="ON" on:change={handleFanChange} />
        </Column>
    </Row>
    <Row>
        <Column>
            <ButtonSet>
                <Button>Start</Button>
            </ButtonSet>
        </Column>
    </Row>
</Grid>
