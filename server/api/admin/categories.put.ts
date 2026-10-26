import { db } from '../../db';
import { categories } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // 1. Проверяем права администратора
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  // 2. Читаем данные из тела запроса
  const body = await readBody(event);
  const { id, name, slug } = body;

  if (!id || !name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Все поля (id, name, slug) обязательны для заполнения.'
    });
  }

  try {
    // 3. Обновляем категорию в базе данных
    await db
      .update(categories)
      .set({ name, slug })
      .where(eq(categories.id, Number(id)));

    return { success: true, message: 'Категория успешно обновлена!' };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Ошибка обновления категории в базе данных.'
    });
  }
});
