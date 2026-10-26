<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'notfooter',
  middleware: 'auth' // Защита: гостей сюда не пустит наш Middleware
})

const { user, clear } = useUserSession()
const router = useRouter()

// Переменные для списка личных заявок пользователя
const myOrders = ref([])
const ordersError = ref('')
const isOrdersLoading = ref(false)

// Загружаем заявки пользователя при открытии страницы
onMounted(async () => {
  isOrdersLoading.value = true
  try {
    myOrders.value = await $fetch('/api/user-orders')
  } catch (error) {
    ordersError.value = 'Не удалось загрузить историю ваших заявок'
  } finally {
    isOrdersLoading.value = false
  }
})

const handleLogout = async () => {
  await clear()
  router.push('/auth/login')
}
</script>

<template>
  <div class="w-full text-left space-y-6">
    <h1 class="text-lg font-bold bg-black/90 text-white p-2.5 px-5 tracking-wide uppercase text-sm">
      Личный кабинет
    </h1>

    <!-- Сетка из двух колонок: Слева данные профиля, Справа список «Мои заявки» -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      
      <!-- КОЛОНКА 1: Профиль пользователя -->
      <section class="border border-gray-400 p-6 bg-white rounded md:col-span-1 space-y-4">
        <h2 class="font-bold text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Профиль</h2>
        <div class="text-sm space-y-1.5">
          <p><strong>Имя:</strong> {{ user?.name }}</p>
          <p class="truncate"><strong>Email:</strong> {{ user?.email }}</p>
        </div>
        <button @click="handleLogout" class="w-full text-black border border-gray-400 p-2 text-xs font-bold uppercase tracking-wider hover:bg-red-300 transition-colors cursor-pointer mt-4">
          Выйти из аккаунта
        </button>
      </section>

      <!-- КОЛОНКА 2: Вкладка "Мои заявки" -->
      <section class="border border-gray-400 p-6 bg-white rounded md:col-span-2">
        <h2 class="font-bold text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">Мои заявки</h2>
        
        <p v-if="ordersError" class="text-red-600 text-xs font-medium">{{ ordersError }}</p>
        <p v-if="isOrdersLoading" class="text-gray-500 text-xs italic">Загрузка истории заявок...</p>

        <!-- Список заявок -->
        <div v-if="myOrders.length > 0" class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div v-for="order in myOrders" :key="order.id" class="border border-gray-300 p-3 bg-gray-50 rounded flex justify-between items-center text-sm">
            <div class="text-left space-y-0.5 max-w-[70%]">
              <h4 class="font-bold text-black uppercase truncate text-xs">{{ order.productName || 'Товар удален' }}</h4>
              <p class="text-gray-500 text-xs">Стоимость: <span class="font-bold text-black">{{ order.productPrice }}</span></p>
              <p class="text-[10px] text-gray-400 font-medium">Дата: {{ new Date(order.createdAt).toLocaleDateString() }}</p>
            </div>
            
            <!-- Статус заявки с красивой цветовой индикацией -->
            <span 
              :class="{
                'text-black border border-black select-none': order.status === 'new',
                'text-black border border-black select-none': order.status === 'in_progress',
                'text-black border border-black select-none': order.status === 'completed'
              }"
              class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border rounded-full"
            >
              {{ order.status === 'new' ? 'Новая' : order.status === 'in_progress' ? 'В работе' : 'Завершена' }}
            </span>
          </div>
        </div>

        <p v-else-if="!isOrdersLoading && !ordersError" class="text-gray-500 text-xs italic py-4">
          Вы еще не оставляли заявок на подбор и заказ колес.
        </p>
      </section>

    </div>
  </div>
</template>
