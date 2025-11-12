import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

export default defineConfig(() => ({
	server: {
		host: "::",
		port: 8080
	},
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/components/VideoPlayer/index.ts"),
			name: "AuraVideoPlayer",
			formats: ["es"],
			fileName: () => "index.js"
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM"
				}
			}
		},
		cssCodeSplit: false,
		sourcemap: false
	}
}))
