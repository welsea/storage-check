import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	preview: {
		host: '0.0.0.0',
		port: 3000,
		allowedHosts: ['cabin.welsea.site'], // ✅ allow your domain here
	  },
});
