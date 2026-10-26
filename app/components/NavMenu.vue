<template>
    <nav class="w-full border-b border-gray-400 bg-gray-50">
        <div class="flex w-full max-w-[1444px] mx-auto items-center gap-6 p-2.5 px-6 lg:px-20 text-xs font-bold uppercase tracking-wider">
        
        <NuxtLink 
            to="/" 
            class="text-black hover:text-gray-500 transition-colors"
            active-class="underline decoration-2 underline-offset-4"
        >
            Главная
        </NuxtLink>

    
        <NuxtLink 
            to="/catalog" 
            class="text-black hover:text-gray-500 transition-colors"
            active-class="underline decoration-2 underline-offset-4"
        >
            Каталог
        </NuxtLink>

        </div>
    </nav>
</template>