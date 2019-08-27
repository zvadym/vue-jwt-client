import jwtDecode from 'jwt-decode'
import bus from '@/bus'
import axios from '@/axios'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    jsonWebToken: null,
    userEmail: null,
    userName: null,
    formErrors: {}
  },
  mutations: {
    setAuthCredentials (state, authData) {
      state.jsonWebToken = authData.token
    },
    clearAuthCredentials (state) {
      state.jsonWebToken = null
    },
    setFormErrors (state, errors) {
      state.formErrors = errors
    },
    clearFormErrors (state) {
      state.formErrors = {}
    },
    setUserEmail (state, email) {
      state.userEmail = email
    },
    clearUserEmail (state) {
      state.userEmail = null
    },
    setUserName (state, name) {
      state.userName = name
    },
    clearUserName (state) {
      state.userName = null
    }
  },
  actions: {
    login ({ commit, dispatch }, credentials) {
      axios.post(
        process.env.VUE_APP_API_LOGIN_URL,
        { email: credentials.email, password: credentials.password })
        .then((response) => {
          const token = response.data.token
          const decoded = jwtDecode(token)
          const expirationDate = new Date(decoded.exp * 1000)

          window.localStorage.setItem('auth_token', token)
          window.localStorage.setItem('auth_expiration', expirationDate)

          commit('setAuthCredentials', { token })
          dispatch('setLogoutTimer', expirationDate)

          router.push({ name: 'Dashboard' })
        }).catch(() => {}) // See axios config for basic error handling
    },
    logout ({ commit, state }) {
      axios.post(
        process.env.VUE_APP_API_LOGOUT_URL,
        { token: state.jsonWebToken }
      )
      commit('clearAuthCredentials')
      commit('clearUserEmail')
      commit('clearUserName')

      bus.$emit('flash', 'Goodbye! Your session has ended.', 'success')

      window.localStorage.removeItem('auth_token')
      window.localStorage.removeItem('auth_expiration')
      router.push({ name: 'Login' })
    },
    verify ({ commit, state }) {
      axios.post(
        process.env.VUE_APP_API_VERIFY_URL,
        { token: state.jsonWebToken }
      ).then(response => {
        bus.$emit('flash', 'Current token is valid!', 'info')
      }).catch(() => {
        bus.$emit('flash', 'Current token is invalid!', 'danger')
      })
    },
    setLogoutTimer ({ commit }, expirationTime) {
      setTimeout(() => {
        commit('clearAuthCredentials')
      }, expirationTime - new Date())
    },
    tryAutoLogin ({ commit }) {
      const jwt = window.localStorage.getItem('auth_token')
      if (!jwt) {
        return
      }
      const expirationDate = window.localStorage.getItem('auth_expiration')
        ? new Date(window.localStorage.getItem('auth_expiration')) : ''
      const now = new Date()

      if (now >= expirationDate) {
        window.localStorage.removeItem('auth_token')
        window.localStorage.removeItem('auth_expiration')
        commit('clearAuthCredentials')
        return
      }
      commit('setAuthCredentials', {
        token: jwt
      })
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.jsonWebToken !== null
    },
    jsonWebToken (state) {
      return state.jsonWebToken
    },
    userEmail (state) {
      return state.userEmail
    },
    userName (state) {
      return state.userName
    },
    hasValidationError: (state) => (input) => {
      return Object.prototype.hasOwnProperty.call(state.formErrors, input)
    },
    getValidationError: (state) => (input) => {
      if (Object.prototype.hasOwnProperty.call(state.formErrors, input)) {
        const error = state.formErrors[input]

        return Array.isArray(error) ? error[0] : error
      }

      return null
    }
  }
}
