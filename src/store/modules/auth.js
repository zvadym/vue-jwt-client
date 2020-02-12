import jwtDecode from 'jwt-decode'
import bus from '@/bus'
import axios from '@/axios'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    jwtAccess: null,
    jwtRefresh: null,

    timeoutId: null,

    userData: null,
    formErrors: {}
  },
  mutations: {
    setAccessToken(state, token) {
      state.jwtAccess = token
    },
    setRefreshToken(state, token) {
      state.jwtRefresh = token
    },
    clearAuthCredentials(state) {
      state.jwtAccess = null
      state.jwtRefresh = null
    },
    updateTimeoutId(state, timeoutId) {
      state.timeoutId = timeoutId
    },
    setFormErrors(state, errors) {
      state.formErrors = errors
    },
    clearFormErrors(state) {
      state.formErrors = {}
    },
    setUserData(state, data) {
      state.userData = data
    },
    clearUserData(state) {
      state.userData = null
    }
  },
  actions: {
    login({ commit, dispatch }, credentials) {
      axios
        .post(process.env.VUE_APP_API_LOGIN_URL, {
          username: credentials.email,
          password: credentials.password
        })
        .then(response => {
          const accessToken = response.data.access
          const refreshToken = response.data.refresh

          window.localStorage.setItem('auth_refresh_token', refreshToken)

          dispatch('updateRefreshToken', refreshToken)
            .then(() => {
              return dispatch('updateAccessToken', accessToken)
            })
            .then(() => {
              // Go to "home" page
              router.push({ name: 'Dashboard' })
            })
        })
        .catch(() => {}) // See axios config for basic error handling
    },
    logout({ commit, state }) {
      axios.post(process.env.VUE_APP_API_LOGOUT_URL, {
        refresh: state.jwtRefresh
      })
      // commit('clearAuthCredentials')
      // commit('clearUserData')

      // bus.$emit('flash', 'Goodbye! Your session has ended.', 'success')
      // window.localStorage.removeItem('auth_refresh_token')
      // router.push({ name: 'Login' })
    },
    refresh({ commit, state }) {
      const refreshToken = state.jwtRefresh

      return axios
        .post(process.env.VUE_APP_API_REFRESH_URL, {
          refresh: refreshToken
        })
        .then(response => {
          commit('setAccessToken', response.data.access)
          bus.$emit('flash', 'Access token is updated')
        })
        .catch(() => {
          throw new Error('Bad refresh token')
        })
    },
    verify({ commit, state }) {
      axios
        .post(process.env.VUE_APP_API_VERIFY_URL, {
          token: state.jwtRefresh
        })
        .then(response => {
          bus.$emit('flash', 'Current token is valid!', 'info')
        })
        .catch(() => {
          bus.$emit('flash', 'Current token is invalid!', 'danger')
        })
    },
    updateAccessToken({ commit, dispatch }, token) {
      commit('setAccessToken', token)

      // Refresh "access" token when it expires
      return dispatch('setRefreshTimer', new Date(jwtDecode(token).exp * 1000))
    },
    updateRefreshToken({ commit }, token) {
      commit('setRefreshToken', token)
    },
    setRefreshTimer({ state, commit, dispatch }, expirationTime) {
      clearTimeout(state.timeoutId)

      const timeoutId = setTimeout(() => {
        bus.$emit('flash', 'Access token is expired')
        dispatch('refresh')
      }, expirationTime - new Date())

      commit('updateTimeoutId', timeoutId)
    },
    tryAutoLogin({ commit, dispatch }) {
      const refreshToken = window.localStorage.getItem('auth_refresh_token')

      if (!refreshToken) {
        return
      }

      const expirationDate = new Date(jwtDecode(refreshToken).exp * 1000)

      if (new Date() >= expirationDate) {
        bus.$emit('flash', 'Autologin is failed. Tokes is expired.', 'warning')
        window.localStorage.removeItem('auth_refresh_token')
        commit('clearAuthCredentials')
        return
      }

      dispatch('updateRefreshToken', refreshToken).then(() => {
        return dispatch('refresh').then(
          () => {
            bus.$emit('flash', 'Autologin => success')
            router.push({ name: 'Dashboard' })
          },
          error => {
            bus.$emit(
              'flash',
              `Autologin failded - ${error.message}`,
              'warning'
            )
          }
        )
      })
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.jwtAccess !== null
    },
    jwtAccess(state) {
      return state.jwtAccess
    },
    userEmail(state) {
      return state.userData.email
    },
    userName(state) {
      return state.userData.name
    },
    hasValidationError: state => input => {
      return Object.prototype.hasOwnProperty.call(state.formErrors, input)
    },
    getValidationError: state => input => {
      if (Object.prototype.hasOwnProperty.call(state.formErrors, input)) {
        const error = state.formErrors[input]
        return Array.isArray(error) ? error[0] : error
      }
      return null
    }
  }
}
