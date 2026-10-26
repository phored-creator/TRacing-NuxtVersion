<!-- layouts/notFooter.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Шапка -->
    <Header />

    <!-- Контент -->
    <div class="w-full max-w-[1200px] mx-auto py-10 px-3 flex-grow">
      <slot />
    </div>
  </div>
</template>