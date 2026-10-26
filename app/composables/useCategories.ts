import { ref } from 'vue'

const categoriesList = ref([])

export const useCategories = () => {
// Функция, чтобы сходить в базу данных и обновить доску
  const fetchCategories = async () => {
    categoriesList.value = await $fetch('/api/categories')
}

// Возвращаем доску и функцию наружу
return { categoriesList, fetchCategories }

}