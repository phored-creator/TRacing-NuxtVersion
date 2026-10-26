<script setup>
// Получаем доступ к текущему id из адресной строки браузера (например, /catalog/1)
const route = useRoute()
const productId = route.params.id

// Запрашиваем данные конкретного товара с динамического эндпоинта
const { data: product, error } = await useFetch(`/api/products/${productId}`)
</script>

<template>
  <div class="w-full text-left">
    <!-- Обработка ошибки 404, если товара нет в базе -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
      <h2 class="font-bold">Ошибка 404</h2>
      <p>Товар не найден или удален администратором.</p>
      <NuxtLink to="/catalog" class="underline font-bold text-xs mt-2 inline-block">Вернуться в каталог</NuxtLink>
    </div>

    <!-- Отображение карточки товара -->
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      
      <!-- Левая колонка: Большое изображение товара -->
      <div class="border border-gray-400 bg-white p-4 flex items-center justify-center h-[300px] md:h-[450px] overflow-hidden">
        <img 
          :src="product.image" 
          :alt="product.name" 
          class="max-w-full max-h-full object-contain select-none pointer-events-none grayscale hover:grayscale-0 transition-all duration-300"
        />
      </div>

      <!-- Правая колонка: Информация и характеристики -->
      <div class="flex flex-col justify-between border border-gray-400 p-6 bg-white">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
            Категория: {{ product.categoryName || 'Без категории' }}
          </span>
          <h1 class="text-xl md:text-2xl font-black text-black uppercase tracking-wide mt-2">
            {{ product.name }}
          </h1>

          <!-- Таблица характеристик (прямой вывод из колонок MySQL) -->
          <div class="mt-6">
            <h3 class="font-bold text-xs uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1.5 mb-3">
              Характеристики
            </h3>
            
            <table class="w-full text-sm">
              <tbody>
                <tr v-if="product.brand" class="border-b border-gray-100 last:border-0">
                  <td class="py-2 text-gray-500 font-medium">Производитель</td>
                  <td class="py-2 text-black font-bold text-right">{{ product.brand }}</td>
                </tr>
                
                <tr v-if="product.season" class="border-b border-gray-100 last:border-0">
                  <td class="py-2 text-gray-500 font-medium">Сезонность</td>
                  <td class="py-2 text-black font-bold text-right">{{ product.season }}</td>
                </tr>
                
                <tr v-if="product.diameter" class="border-b border-gray-100 last:border-0">
                  <td class="py-2 text-gray-500 font-medium">Диаметр</td>
                  <td class="py-2 text-black font-bold text-right">{{ product.diameter }}</td>
                </tr>
                
                <tr v-if="product.country" class="border-b border-gray-100 last:border-0">
                  <td class="py-2 text-gray-500 font-medium">Страна производства</td>
                  <td class="py-2 text-black font-bold text-right">{{ product.country }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      <!-- 🟢 Подсказка про размеры -->
        <div class="bg-gray-50 border-l-4 border-black p-3 mt-2">
          <p class="text-xs text-gray-700 font-medium">
            <span class="font-black uppercase tracking-wider">Внимание:</span> 
            Все размеры в наличии. Укажите нужный размер (например, 205/55 R16) в комментарии к заказу.
          </p>
        </div>

        <!-- Цена и кнопка покупки -->
        <div class="border-t border-gray-300 pt-6 mt-2 flex items-center justify-between gap-4">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Цена за штуку</span>
            <span class="text-2xl font-black text-black tracking-tight">${{ product.price }}</span>
          </div>

          <!-- Изменяем кнопку в файле catalog/[id].vue -->
          <NuxtLink 
            :to="`/order?product=${product.id}`"
            class="bg-black/90 text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 hover:bg-black transition-colors rounded-xs block text-center"
          >
            Оставить заявку
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>
