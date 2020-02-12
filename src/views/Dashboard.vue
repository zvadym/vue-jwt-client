<template>
  <div>
    <div class="max-w rounded overflow-hidden shadow-lg p-2 mb-3">
      <p v-if="userData">My data: {{ userData }}</p>
      <p v-else>Loading...</p>

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded"
        @click="fetchData"
      >
        Update data
      </button>
    </div>

    <div v-if="accessToken">
      <div class="max-w rounded overflow-hidden shadow-lg p-2 mb-3">
        <div class="font-bold text-l mb-2">Access Token:</div>
        <pre class="whitespace-pre-wrap break-words">
          {{ accessToken }}
        </pre>
        <div class="text-sm mb-2">
          <span class="font-bold">Expiration:</span> {{ accessExpiration }}
        </div>
      </div>

      <div class="max-w rounded overflow-hidden shadow-lg p-2 mb-3">
        <div class="font-bold text-l mb-2">Refresh Token:</div>
        <pre class="whitespace-pre-wrap break-words mb-2">
          {{ refreshToken }}
        </pre>
        <div class="text-sm mb-2">
          <span class="font-bold">Expiration:</span> {{ refreshExpiration }}
        </div>
      </div>

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="button"
        @click="verify"
      >
        Verify
      </button>

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded"
        @click="logout"
      >
        Log Out
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded"
        @click="refresh"
      >
        Refresh
      </button>
    </div>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import axios from '@/axios'
import bus from '@/bus'

const dataUrl = 'user/detail/'

export default {
  data() {
    return {
      userData: null
    }
  },
  computed: {
    accessToken() {
      return this.$store.state.auth.jwtAccess
    },
    refreshToken() {
      return this.$store.state.auth.jwtRefresh
    },
    authenticated() {
      return this.$store.getters['auth/isAuthenticated']
    },
    userEmail() {
      return this.$store.getters['auth/userEmail']
    },
    accessExpiration() {
      const decoded = jwtDecode(this.accessToken)
      return new Date(decoded.exp * 1000)
    },
    refreshExpiration() {
      const decoded = jwtDecode(this.refreshToken)
      return new Date(decoded.exp * 1000)
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    },
    verify() {
      this.$store.dispatch('auth/verify')
    },
    refresh() {
      this.$store.dispatch('auth/refresh')
    },
    fetchData() {
      axios
        .get(dataUrl)
        .then(response => {
          this.userData = response.data
        })
        .catch(() => {
          bus.$emit(
            'flash',
            'I could not retrieve your user profile from the server.',
            'danger'
          )
        })
    }
  }
}
</script>
