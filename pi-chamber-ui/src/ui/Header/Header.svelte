<script lang="ts">
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderGlobalAction,
        HeaderPanelLinks,
        HeaderPanelDivider,
        HeaderPanelLink,
        SkipToContent,
    } from 'carbon-components-svelte'
    import IconReload from '../Icons/IconReload.svelte'
    import IconShutdown from '../Icons/IconShutdown.svelte'

    export let onreload
    export let onshutdown

    export let isSideNavOpen = false
    let isOpen = false
</script>

<Header company="PI" platformName="Chamber" bind:isSideNavOpen>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>

    <HeaderUtilities>
        <HeaderAction bind:isOpen text="Menu">
            <HeaderPanelLinks>
                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 5</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction>

        <HeaderGlobalAction iconDescription="Reload" tooltipAlignment="end" icon={IconReload} onclick={onreload} />
        <HeaderGlobalAction iconDescription="Reload" tooltipAlignment="end" icon={IconShutdown} onclick={onshutdown} />
    </HeaderUtilities>
</Header>
