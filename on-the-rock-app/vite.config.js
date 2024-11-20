import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	esbuild: {
		jsxInject: `import React from 'react'`,
	},
	server: {
		proxy: {
			"/api": {
				target: "https://ontherock.lol:8000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/openvidu": {
				target: "https//ontherock.lol:4443",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/openvidu/, ''),
			},
			// "/ws": {
			// 	target: 'http://ontherock.lol:8000/ws',
      //   ws: true,  // WebSocket 프록시 설정
			// 	changeOrigin: true,
			// },
		},
	},
});
