<template>
  <div>
    <h1>Dashboard</h1>
    <p
      v-if="userData"
      class="text-center mt-8"
    >
      Users data:  {{ userData }}
    </p>
    <p v-else>
      Loading...
    </p>
  </div>
</template>

<script>
import axios from '@/axios'
import bus from '@/bus'

const dataUrl = 'auth/user-details/'

export default {
  data() {
    return {
      userData: null    
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      axios.get(dataUrl)
        .then((response) => {          
          this.userData = response.data
        })
        .catch(() => {
          bus.$emit('flash', 'I could not retrieve your user profile from the server.', 'danger')
        })
    }
  }  
}
</script>