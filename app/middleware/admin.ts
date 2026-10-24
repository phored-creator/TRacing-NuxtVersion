export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Получаем данные сессии пользователя
  const { user } = useUserSession()

  // 2. Проверяем: если пользователя нет в сессии ИЛИ его роль не 'admin1'
  if (!user.value || user.value.role !== 'admin1') {
    // 3. Отправляем его на главную страницу (или на 403 ошибку)
    return navigateTo('/')
  }
})
