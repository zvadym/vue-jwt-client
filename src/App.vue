<template>
  <div
    id="app"
    class="container mx-auto bg-white min-h-screen shadow-md flex flex-col justify-between"
  >
    <nav class="flex items-center justify-between flex-wrap bg-purple p-6">
      <div class="flex items-center flex-no-shrink mr-6">
        <span class="font-semibold text-xl tracking-tight">PoC JWT Client</span>
      </div>
      <div class="block lg:hidden">
        <button class="flex items-center px-3 py-2 border rounded text-purple-lighter border-purple-light hover:border-white">
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          ><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
        </button>
      </div>
      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <div v-if="authenticated">
            <router-link
              :to="{ name: 'Dashboard' }"
              class="block mt-4 lg:inline-block lg:mt-0 text-purple-lightest no-underline mr-4"
            >
              Dashboard
            </router-link>
          </div>
        </div>
        <div v-if="!authenticated">
          <router-link
            :to="{ name: 'Login' }"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log In
          </router-link>
        </div>
        <div v-else>
          <span class="">{{ userEmail }}</span>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="logout"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
    <div class="p-8 flex-auto">
      <router-view />
    </div>
    <div
      v-if="token"
      class="p-4 bg-grey-lighter"
    >
      <h5 class="mb-1">
        JSON Web Token
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          @click="verify"
        >
          Verify
        </button>
      </h5>
      <pre class="whitespace-pre-wrap break-words">{{ token }}</pre>
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
  },
  computed: {
    token () {
      return this.$store.getters['auth/jsonWebToken']
    },
    authenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    userEmail () {
      return this.$store.getters['auth/userEmail']
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
    },
    verify () {
      this.$store.dispatch('auth/verify')
    }
  }
}
</script>
