import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { optimizeImports, optimizeCss } from 'carbon-preprocess-svelte'

export default {
    // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
    // for more information about preprocessors
    preprocess: [vitePreprocess(), optimizeImports(), optimizeCss()],
}
