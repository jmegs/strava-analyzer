import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { FontaineTransform } from "fontaine"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		tailwindcss(),
		FontaineTransform.vite({
			fallbacks: ["ui-monospace", "SFMono-Regular", "monospace"],
			resolvePath: (id) => `file:///public/${id}`,
		}),
		reactRouter(),
		tsconfigPaths(),
	],
})
