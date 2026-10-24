import { db } from '../../db';
import { users } from '../../db/schema';

export default defineEventHandler(async (event) => {
  // 1. Получаем сессию текущего пользователя
  const session = await getUserSession(event);

  // 2. Проверяем: если пользователь не вошел ИЛИ он не админ — выкидываем ошибку безопасности
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  try {
    // 3. Если это админ, вытаскиваем из MySQL список всех пользователей
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    }).from(users);

    return allUsers;
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Ошибка БД' });
  }
});
