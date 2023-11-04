import type { Config } from 'tailwindcss';
import tailwindcssForms from '@tailwindcss/forms';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {}
	},
	plugins: [
		// require("@tailwindcss/forms")({
		// 	strategy: 'class'
		// })
		tailwindcssForms({
			strategy: 'class'
		})
	]
};
export default config;
