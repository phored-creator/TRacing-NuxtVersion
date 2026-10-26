import { db } from '../../db';
import { products } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // 1. Проверяем сессию и права администратора
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  // 2. Читаем данные из тела запроса
  const body = await readBody(event);
  const { id, name, category, price, image, brand, season, diameter, country } = body;

  if (!id || !name || !category || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пожалуйста, заполните обязательные поля: Название, Категория, Цена'
    });
  }

  try {
    // 3. Выполняем SQL-запрос UPDATE в MySQL через Drizzle
    await db
      .update(products)
      .set({
        name,
        category: Number(category),
        price,
        image,
        brand: brand || '',
        season: season || '',
        diameter: diameter || '',
        country: country || ''
      })
      .where(eq(products.id, Number(id)));

    return { success: true, message: 'Товар успешно обновлен!' };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Ошибка обновления товара в базе данных'
    });
  }
});
