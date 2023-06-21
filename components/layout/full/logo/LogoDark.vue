<script setup lang="ts">
const config = useRuntimeConfig()

const imageLogo = ref('')

const { data: dataLogo } = await useCustomFetch('/api/utils/type/logo', {
  method: 'get'
})
watch(dataLogo, (val) => {
  imageLogo.value = ''
  imageLogo.value = val?.image
})
</script>
<template>
  <div class="logo">
    <NuxtLink to="/">
      <div class="d-inline-flex align-center  mx-4">
        <img
          :src="`${config.public.apiBase}${imageLogo}`"
          :lazy-src="`${config.public.apiBase}${imageLogo}`"
          style="width:180px; object-fit: contain"
        >
      </div>
    </NuxtLink>
  </div>
</template>
