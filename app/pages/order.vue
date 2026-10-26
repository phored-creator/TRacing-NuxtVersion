<script setup>
import { ref, onMounted } from 'vue'

const route = useRoute()

// 1. Получаем ID товара из адресной строки (например, если ссылка /order?product=5)
const productId = route.query.product

// Переменная для хранения данных товара
const product = ref(null)
const isProdLoading = ref(false)

// Переменные для полей формы заявки
const clientName = ref('')
const clientPhone = ref('')
const clientComment = ref('')

// Статусы отправки заявки
const errorMsg = ref('')
const successMsg = ref('')
const isLoading = ref(false)

// Загружаем данные о выбранном товаре с нашего эндпоинта по ID
onMounted(async () => {
  if (productId) {
    isProdLoading.value = true
    try {
      product.value = await $fetch(`/api/products/${productId}`)
    } catch (e) {
      console.error('Не удалось загрузить товар для заявки', e)
    } finally {
      isProdLoading.value = false
    }
  }
})

// Функция отправки заявки
const handleSendOrder = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  isLoading.value = true

  try {
    // Отправляем запрос на сервер
    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        productId: productId,
        clientName: clientName.value,
        clientPhone: clientPhone.value,
        clientComment: clientComment.value
      }
    })

    if (response.success) {
      successMsg.value = 'Заявка успешно отправлена! Менеджер свяжется с вами для уточнения параметров колес.'
      clientName.value = ''
      clientPhone.value = ''
      clientComment.value = ''
    }
  } catch (error) {
    const err = error
    errorMsg.value = err.data?.statusMessage || 'Не удалось отправить заявку.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto space-y-6 text-left">
    
    <!-- ЗАГОЛОВОК -->
    <h1 class="text-xl font-bold bg-black/90 text-white p-2.5 px-5 tracking-wide uppercase text-sm">
      Оформление заявки под заказ
    </h1>

    <!-- ФОРМА СВЯЗИ -->
    <section class="border border-gray-400 p-6 bg-white rounded">
      <p v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 text-xs font-medium mb-4">{{ errorMsg }}</p>
      <p v-if="successMsg" class="bg-green-50 border-l-4 border-green-500 text-green-700 p-2.5 text-xs font-medium mb-4">{{ successMsg }}</p>

      <form @submit.prevent="handleSendOrder" class="flex flex-col gap-4">
        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Ваше Имя *</label>
          <input v-model="clientName" type="text" required placeholder="Иван Иванов" :disabled="isLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
        </div>

        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Телефон для связи *</label>
          <input v-model="clientPhone" type="tel" required placeholder="+7 (999) 123-45-67" :disabled="isLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
        </div>

        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Комментарий к заказу (необязательно)</label>
          <textarea v-model="clientComment" rows="3" placeholder="Например: Нужен комплект из 4 штук, передние 225/40, задние 255/35" :disabled="isLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded resize-none"></textarea>
        </div>

        <button type="submit" :disabled="isLoading" class="w-full bg-black/90 text-white p-3 font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer rounded mt-2">
          {{ isLoading ? 'Отправка...' : 'Подтвердить заказ' }}
        </button>
      </form>
    </section>

    <!-- 🛒 ИНФОРМАЦИЯ О ВЫБРАННОМ ТОВАРЕ -->
    <section v-if="product" class="border border-gray-400 bg-gray-50 p-4 rounded flex flex-col sm:flex-row gap-4 items-center">
      <!-- Маленькая превьюшка колеса -->
      <div class="w-24 h-24 bg-white border border-gray-300 p-2 flex items-center justify-center rounded overflow-hidden flex-shrink-0">
        <img :src="product.image" :alt="product.name" class="max-w-full max-h-full object-contain grayscale" />
      </div>
      
      <!-- Текстовые данные -->
      <div class="flex-grow text-center sm:text-left space-y-1">
        <span class="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-200 px-2 py-0.5 rounded">Выбранный товар</span>
        <h3 class="font-bold text-sm text-black uppercase tracking-wide pt-1">{{ product.name }}</h3>
        <p v-if="product.brand || product.diameter" class="text-xs text-gray-500 font-medium">
          {{ product.brand }} <span v-if="product.diameter">| {{ product.diameter }}</span>
        </p>
        <p class="text-base font-black text-black pt-1">${{ product.price }}</p>
      </div>
    </section>

    <!-- Лоадер, пока данные колеса подгружаются из MySQL -->
    <p v-else-if="isProdLoading" class="text-gray-500 text-xs italic text-center">Загрузка информации о товаре...</p>

  </div>
</template>
