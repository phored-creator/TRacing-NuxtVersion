import { db } from '../../db';
import { products } from '../../db/schema';

export default defineEventHandler(async (event) => {
  // 1. Проверяем сессию и права администратора
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  // 2. Читаем данные из формы добавления
  const body = await readBody(event);
  const { name, category, price, image, brand, season, diameter, country } = body;

  // 3. Валидация полей
  if (!name || !category || !price || !image) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пожалуйста, заполните все поля товара'
    });
  }

  try {
    // 4. Вставляем новый товар в MySQL таблицу через Drizzle
    await db.insert(products).values({
      name,
      category: Number(category),
      price,
      image: image,
      brand,
      season,
      diameter,
      country
    });

    return { success: true, message: 'Товар успешно добавлен в каталог!' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при сохранении товара в базу данных'
    });
  }
});
