import { defineConfig } from "tsup"

export default defineConfig({
	// Emit dist/index.js + dist/index.cjs + dist/index.d.ts
	entry: { index: "./src/components/VideoPlayer/index.ts" },
	format: ["esm", "cjs"],
	dts: true,
	outDir: "dist",
	clean: true,
	sourcemap: true,
	minify: true,
	treeshake: true,
	splitting: false,
	external: ["react", "react-dom"] // keep if this is a React lib
})
