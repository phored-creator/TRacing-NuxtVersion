export default defineNuxtRouteMiddleware((to, from) => {
  // Вытаскиваем реактивный статус проверки авторизации
  const { loggedIn } = useUserSession()

  // Если пользователь НЕ вошел в аккаунт (кука отсутствует)
  if (!loggedIn.value) {
    // Мгновенно отправляем его на страницу логина
    return navigateTo('/login')
  }
})
