import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	css: ["~/assets/css/app.css"],
	devtools: { enabled: true },
	modules: ["@nuxt/fonts", "nuxt-auth-utils"],
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
