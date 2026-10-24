import { db } from '../db';
import { products } from '../db/schema';

export default defineEventHandler(async (event) => {
  try {
    // Делаем прямую выборку всех товаров из таблицы products в MySQL
    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
        price: products.price,
        image: products.image,
        brand: products.brand,
        season: products.season,
        diameter: products.diameter,
        country: products.country
      })
      .from(products);

    return allProducts;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось загрузить товары из базы данных'
    });
  }
});
