import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	css: ["~/assets/css/app.css"],
	devtools: { enabled: true },
	modules: ["@nuxt/fonts", "nuxt-auth-utils"],
	vite: {
		plugins: [tailwindcss()],
	},
});

