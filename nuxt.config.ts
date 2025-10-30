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
		session: {
			maxAge: 60 * 60 * 24 * 30, // 30 days
			password: ""
		},
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
