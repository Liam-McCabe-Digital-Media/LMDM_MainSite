/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./public/*.{html, js, css}', './views/**/*.ejs', './views/layouts/*.ejs'],
	// corePlugins: {
	// 	preflight: false,
	// },
	theme: {
		minWidth: {
			xl: '36rem',
		},
		extend: {},
	},
	plugins: [],
};
