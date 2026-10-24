import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  // 1. Читаем данные из формы
  const body = await readBody(event);
  const { name, email, password } = body;

  // 2. Проверяем заполнение полей
  if (!name || !email || !password) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Пожалуйста, заполните все обязательные поля' 
    });
  }

  try {
    // 3. Проверяем, нет ли уже такого email в базе данных
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Пользователь с таким Email уже зарегистрирован' 
      });
    }

    // 4. Хэшируем пароль для безопасности
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Записываем нового пользователя в вашу таблицу MySQL в Debian
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { 
      success: true, 
      message: 'Вы успешно зарегистрировались!' 
    };

  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Внутренняя ошибка сервера при регистрации',
    });
  }
});
