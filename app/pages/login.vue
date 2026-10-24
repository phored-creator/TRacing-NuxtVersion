<script setup>
import { ref } from 'vue'

definePageMeta({
    middleware: 'guest'
})

// Переменные для хранения данных из полей ввода
const email = ref('')
const password = ref('')

// Переменные для вывода сообщений о статусе
const errorMsg = ref('')
const successMsg = ref('')
const isLoading = ref(false)

const { fetch: fetchSession } = useUserSession()

const router = useRouter()

// Функция отправки запроса на вход
const handleLogin = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  isLoading.value = true

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    if (response.success) {
      successMsg.value = response.message
      
      await fetchSession()

      setTimeout(() => {
        router.push('/profile')
      }, 1000)
    }
  } catch (error) {
    // Выводим ошибку, которую нам вернул сервер
    errorMsg.value = error.data?.statusMessage || 'Ошибка входа'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
    <section class="w-full max-w-md mx-auto border border-gray-400 text-center">
        <h2 class="font-bold text-white text-center bg-black/90 p-2 tracking-wide text-lg">
            Вход в аккаунт
        </h2>

        <form class="flex flex-col p-6" @submit.prevent="handleLogin">
            <!-- Вывод ошибок или успешного статуса -->
            <p v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 text-xs font-medium rounded-r">
                {{ errorMsg }}
            </p>
            <p v-if="successMsg" class="bg-green-50 border-l-4 border-green-500 text-green-700 p-2.5 text-xs font-medium rounded-r">
                {{ successMsg }}
            </p>

            <div class="flex flex-col mt-4">
                <input 
                    v-model="email" 
                    type="email" 
                    required 
                    placeholder="Введите Email" 
                    class="w-full border border-gray-400 p-2 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                />
            </div>
            <div class="flex flex-col mt-3">
                <input 
                    v-model="password" 
                    type="password" 
                    required 
                    placeholder="Введите пароль" 
                    :disabled="isLoading"
                    class="w-full border border-gray-400 p-2 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                />
            </div>

            <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full bg-black/90 text-white p-2.5 mt-3 font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed" 
            >
                {{ isLoading ? 'Вход...' : 'Войти' }}
            </button>
            <p class="text-left text-base mt-2">У вас нет аккаунта? 
                <NuxtLink 
                    to="/register" 
                    class="text-gray-500"
                >
                    Зарегистрироваться
                </NuxtLink>
            </p>
        </form>
    </section>
</template>