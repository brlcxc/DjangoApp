import react from '@vitejs/plugin-react'

export default {
  base: '/',
  root: 'src/',
  publicDir: '../public/',
  plugins: [react()],
  server: {
    host: true,
    open: true
  },
  build:
	{
		outDir: '../dist/',	
		emptyOutDir: true,
		sourcemap: true
	
	},
}
