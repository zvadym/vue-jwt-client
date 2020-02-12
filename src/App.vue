<template>
  <div
    id="app"
    class="container mx-auto bg-white min-h-screen shadow-md flex flex-col justify-between"
  >
    <nav class="flex items-center justify-between flex-wrap bg-purple p-6">
      <div class="flex items-center flex-no-shrink mr-6">
        <span class="font-semibold text-xl tracking-tight">PoC JWT Client</span>
      </div>
    </nav>

    <div class="p-8 flex-auto">
      <router-view />
    </div>
    <flash-stack />
  </div>
</template>

<script>
import FlashStack from '@/components/FlashStack.vue'

export default {
  name: 'App',
  components: {
    'flash-stack': FlashStack
  }
}
</script>
