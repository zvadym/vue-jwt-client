<template>
  <div
    v-show="show"
    class="alert"
    :class="level"
    role="alert"
  >
    <div
      class="dismiss"
      @click="dismiss"
    >
      <icon
        name="times"
        class="float-right cursor-pointer mx-2"
      />
    </div>
    {{ body }}
  </div>
</template>

<script>
import 'vue-awesome/icons/times'

export default {
  props: ['message', 'level', 'nonce', 'delay'],
  data () {
    return {
      body: '',
      type: 'info',
      show: true
    }
  },
  created () {
    this.body = this.message
    if (this.delay > 0) {
      setTimeout(() => {
        this.dismiss()
      }, this.delay)
    }
  },
  methods: {
    dismiss () {
      this.show = false
      this.$emit('remove', this.nonce)
    }
  }
}
</script>
