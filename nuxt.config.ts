import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    'nuxt-auth-utils'
  ],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL
  },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap' },
      ],
    },
  },
})