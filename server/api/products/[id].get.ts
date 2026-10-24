import { db } from '../../db';
import { products } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const productId = parseInt(idParam || '');

  if (isNaN(productId)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный ID' });
  }

  try {
    const foundProducts = await db
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
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    const product = foundProducts[0];

    if (!product) {
      throw createError({ statusCode: 404, statusMessage: 'Товар не найден' });
    }

    return product;
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Ошибка сервера' });
  }
});
