<template>
    <header class="w-full border border-gray-400 bg-white">
        <div class="flex w-full max-w-[1444px] mx-auto items-center justify-between p-4 px-6 lg:px-20 ">
            <!-- Логотип -->
            <NuxtLink to="/">
                <img 
                    src="/logo.svg" 
                    alt="TRacing" 
                    class="h-6 md:h-8 w-auto select-none pointer-events-none" 
                />
            </NuxtLink>
            <!-- Профиль -->
            <NuxtLink to="/profile">
                <img 
                    src="/images/profile.svg" 
                    alt="Профиль" 
                    class="h-5 md:h-6 w-auto select-none pointer-events-none" 
                />
            </NuxtLink>
        </div>
    </header>
</template>