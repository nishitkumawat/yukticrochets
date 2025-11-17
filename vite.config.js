import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Allow both VITE_ and REACT_APP_ prefixes for environment variables.
  envPrefix: ['VITE_', 'REACT_APP_'],
})
