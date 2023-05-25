<script setup lang="ts">
// Page title
const title = ref('404-Page Not Found')
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - 404-Page Not Found`
      : 'Modernize - Nuxt3 Typescript based Free Admin Dashboard Template'
  }
})
const props = defineProps({
  error: {
    type: Object,
    default: () => ({
      message: 'This page you are looking for could not be found.',
      statusCode: 404
    })
  }
})

</script>
<template>
  <div class="d-flex justify-center align-center text-center h-100vh">
    <div>
      <img :src="`/images/background/${props.error.statusCode === 404 ? 'errorimg.svg': '403.jpg'}`" width="500" alt="404">
      <h1 class="text-h1 pt-3">
        Opps!!!
      </h1>
      <h4 class="text-h4 my-8">
        {{ props.error.message }}
      </h4>
      <v-btn flat color="primary" class="mb-4" to="/">
        Go Back to Home
      </v-btn>
    </div>
  </div>
</template>
