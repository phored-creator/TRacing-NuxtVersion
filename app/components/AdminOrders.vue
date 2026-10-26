<script setup>
import { ref, computed, onMounted } from 'vue'


// 🟢 Подключаем composable
const { ordersList, fetchOrders, updateStatus } = useOrders()

// 🟢 Локальная переменная для активной вкладки
const activeOrderTab = ref('new')

// 🟢 Фильтрация заявок по статусу
const filteredOrders = computed(() => {
  if (!ordersList.value) return []
  if (activeOrderTab.value !== 'all') {
    return ordersList.value.filter(ord => ord.status === activeOrderTab.value)
  }
  return ordersList.value
})

// 🟢 Счётчики для кнопок
const getOrderCountByStatus = (status) => {
  if (!ordersList.value) return 0
  if (status === 'all') return ordersList.value.length
  return ordersList.value.filter(ord => ord.status === status).length
}

// 🟢 Загружаем заявки при появлении компонента
onMounted(() => {
  fetchOrders()
})
</script>

<template>
    <section class="border-t border-gray-400 pt-6 mt-6">
        <div class="border-b border-gray-200 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 class="font-bold text-sm uppercase tracking-wider text-black">
                Входящие заявки от клиентов (CRM-Панель)
            </h3>
        
            <!-- 🏎 ГОНОЧНЫЕ ТАБЫ-ПЕРЕКЛЮЧАТЕЛИ -->
            <div class="flex flex-wrap gap-2 bg-gray-100 p-1 rounded border border-gray-300">
                <button 
                type="button"
                @click="activeOrderTab = 'new'"
                :class="activeOrderTab === 'new' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-200'"
                class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer"
                >
                Новые ({{ getOrderCountByStatus('new') }})
                </button>
                <button 
                type="button"
                @click="activeOrderTab = 'in_progress'"
                :class="activeOrderTab === 'in_progress' ? 'bg-yellow-500 text-black shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-200'"
                class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer"
                >
                В работе ({{ getOrderCountByStatus('in_progress') }})
                </button>
                <button 
                type="button"
                @click="activeOrderTab = 'completed'"
                :class="activeOrderTab === 'completed' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-200'"
                class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer"
                >
                Завершенные ({{ getOrderCountByStatus('completed') }})
                </button>
                <button 
                type="button"
                @click="activeOrderTab = 'all'"
                :class="activeOrderTab === 'all' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-200'"
                class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer border-l border-gray-300 pl-3"
                >
                Все ({{ getOrderCountByStatus('all') }})
                </button>
            </div>
        </div>
            <!-- Выводим отфильтрованные заявки через filteredOrders -->
            <div v-if="filteredOrders && filteredOrders.length" class="space-y-3">
            <div v-for="ord in filteredOrders" :key="ord.id" class="border border-gray-400 p-4 bg-gray-50 rounded-sm text-sm text-left flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-black transition-colors bg-white">
                
                <!-- Информация о клиенте, телефоне и выбранной шине/диске -->
                <div class="space-y-1 max-w-xl">
                <div class="flex items-center gap-2">
                    <span class="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-sm">Заявка №{{ ord.id }}</span>
                    <span class="text-xs text-gray-500 font-bold">{{ new Date(ord.createdAt).toLocaleDateString() }}</span>
                </div>
                <p class="text-base font-bold text-black pt-1">
                    Клиент: {{ ord.clientName }} — 
                    <a :href="`tel:${ord.clientPhone}`" class="underline hover:text-gray-600 font-mono text-sm tracking-wide">{{ ord.clientPhone }}</a>
                </p>
                <p class="text-sm font-medium text-gray-700">
                    Товар: <span class="font-bold text-black">{{ ord.productName || 'Товар удален' }}</span> 
                    <span class="text-gray-400 mx-1">|</span> Цена: $ <span class="font-bold text-black">{{ ord.productPrice }}</span>
                </p>
                <p v-if="ord.clientComment" class="text-xs text-gray-500 italic bg-gray-50 p-2 border border-gray-200 rounded-sm mt-1">« {{ ord.clientComment }} »</p>
                </div>

                <!-- Интерактивный выпадающий список для мгновенной смены статуса в MySQL -->
                <div class="flex-shrink-0">
                <select 
                    :value="ord.status"
                    @change="updateStatus(ord.id, $event.target.value)"
                    :class="{
                    'border-blue-400 bg-blue-50 text-blue-700': ord.status === 'new',
                    'border-yellow-500 bg-yellow-50 text-yellow-800': ord.status === 'in_progress',
                    'border-green-400 bg-green-50 text-green-700': ord.status === 'completed'
                    }"
                    class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 border rounded-full focus:outline-none cursor-pointer"
                >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершена</option>
                </select>
                </div>

            </div>
            </div>
            
            <!-- Сообщение, если вкладка пустая -->
            <div v-else class="text-center py-8 border border-dashed border-gray-300 rounded-sm bg-gray-50 text-gray-500 text-xs italic">
            В категории «{{ 
                activeOrderTab === 'new' ? 'Новые' : 
                activeOrderTab === 'in_progress' ? 'В работе' : 
                activeOrderTab === 'completed' ? 'Завершенные' : 'Все' 
            }}» заявок пока нет.
            </div>
    </section>
</template>