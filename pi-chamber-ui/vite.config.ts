import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { optimizeImports, optimizeCss } from 'carbon-preprocess-svelte'

/** @type {import('vite').UserConfig} */
export default defineConfig({
    // Optional: since we use the `optimizeImports` preprocessor, we can exclude
    // `carbon-components-svelte` and `carbon-pictograms-svelte` from the
    // `optimizeDeps` configuration for even faster cold starts.
    optimizeDeps: {
        exclude: ['carbon-components-svelte'],
    },
    plugins: [
        svelte({
            preprocess: [optimizeImports()],
        }),
        optimizeCss(),
    ],
    server: {
        proxy: {
            '/ws': {
                target: 'ws://192.168.1.75:3000',
                changeOrigin: true,
            },
        },
    },
})
