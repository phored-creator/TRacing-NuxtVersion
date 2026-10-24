<script setup>

definePageMeta({
  middleware: 'auth'
})

// Извлекаем данные пользователя и функцию очистки сессии (выхода)
const { user, clear } = useUserSession()
const router = useRouter()

// Функция для выхода из аккаунта
const handleLogout = async () => {
  await clear() // Удаляет зашифрованную куку сессии
  router.push('/login') // Перенаправляем на страницу входа
}
</script>

<template>
  <div>
    <h2>Личный кабинет</h2>

      <p><strong>Привет, {{ user?.name }}!</strong></p>
      <p>Ваш Email: {{ user?.email }}</p>
      <p>Ваш ID в базе данных: {{ user.id }}</p>

      <br />
      <button @click="handleLogout">Выйти из аккаунта</button>
  </div>
</template>
