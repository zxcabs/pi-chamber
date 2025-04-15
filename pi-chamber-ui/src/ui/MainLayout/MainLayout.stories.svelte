<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf'
    import MainLayout from './MainLayout.svelte'

    const { Story } = defineMeta({
        title: 'UI/MainLayout',
        component: MainLayout,
        parameters: {
            layout: 'fullscreen',
        },
        args: {},
    })
</script>

<Story name="default"><MainLayout onreload={() => window.location.reload()}>1212</MainLayout></Story>
