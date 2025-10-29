import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-10-27",
	css: ["~/assets/css/app.css"],
	devtools: { enabled: true },
	experimental: { viteEnvironmentApi: true, typescriptPlugin: true },
	modules: ["@nuxt/fonts", "nuxt-auth-utils", "nitro-cloudflare-dev"],
	nitro: {
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: {
				name: "strava-analyzer",
			},
		},
	},
	runtimeConfig: {
		oauth: {
			strava: {
				clientId: "",
				clientSecret: "",
			},
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
