<script setup>
import { ref } from 'vue'

// Проверка, если пользователь авторизован то => профиль
definePageMeta({
  layout: 'notfooter',
  middleware: 'guest'
})

// Переменные для полей ввода формы
const name = ref('')
const email = ref('')
const password = ref('')

// Переменные для вывода статуса
const errorMsg = ref('')
const successMsg = ref('')
const isLoading = ref(false)

// Функция отправки данных на сервер
const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  isLoading.value = true
  

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value
      }
    })

    if (response.success) {
      successMsg.value = response.message
      // Очищаем поля после успешной регистрации
      name.value = ''
      email.value = ''
      password.value = ''
    }
  } catch (error) {
    // Выводим ошибку бэкенда (например, если email уже занят)
    errorMsg.value = error.data?.statusMessage || 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="w-full max-w-md mx-auto border border-gray-400 rounded">
    <h2 class="font-bold text-base md:text-lg text-white text-center bg-black/90 p-2 tracking-wide">
      Регистрация нового пользователя
    </h2>

    <form class="flex flex-col p-6" @submit.prevent="handleRegister">
      <!-- Вывод ошибок или успешного статуса -->
      <p v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 text-xs font-medium rounded-r">
          {{ errorMsg }}
      </p>
      <p v-if="successMsg" class="bg-green-50 border-l-4 border-green-500 text-green-700 p-2.5 text-xs font-medium rounded-r">
          {{ successMsg }}
      </p>  

      <div class="flex flex-col">
        <input 
          v-model="name" 
          type="text" 
          required 
          placeholder="Введите имя"
          class="w-full border border-gray-400 p-2 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:text-gray-400"
        />
      </div>
      <div class="flex flex-col mt-3">
        <input 
          v-model="email" 
          type="email" 
          required
          placeholder="Введите почту"
          class="w-full border border-gray-400 p-2 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:text-gray-400" 
        />
      </div>
      <div class="flex flex-col mt-3">
        <input 
          v-model="password" 
          type="password" 
          required 
          placeholder="Введите пароль"
          class="w-full border border-gray-400 p-2 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:text-gray-400"
        />
      </div>
      <button 
        type="submit"
        class="w-full bg-black/90 text-white p-2.5 mt-6 font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        Зарегистрироваться
      </button>
      <p class="text-left text-sm mt-2 ">Уже есть аккаунт? 
          <NuxtLink 
              to="/auth/login" 
              class="text-gray-500"
          >
              Войти
          </NuxtLink>
      </p>
    </form>
  </section>
</template>
