<template>
  <div class="flex flex-col min-h-screen bg-gray-50"> <!-- Добавил flex, чтобы прижать футер -->
    <title>TRacing</title>
    <!-- Header сайта -->
    <Header />

    <!-- Навигационное меню сайта -->
    <NavMenu />

    <!-- Основной контент сайта -->
     <main class=" w-full max-w-[1200px] mx-auto py-5 px-4">
        <slot />
    </main>


    <!-- Footer сайта -->
    <Footer />
  </div>
</template>