<script setup lang="ts">
const title = ref('ยูเอสเอยูเคเจแปนทูไทย - Admin')
useHead({
  meta: [{ content: title }, { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Admin`
      : 'ยูเอสเอยูเคเจแปนทูไทย - Admin manage'
  }
})

</script>

<template>
  <ClientOnly>
    <v-locale-provider>
      <v-app>
        <LayoutFullMain />
        <v-main>
          <v-container fluid class="page-wrapper">
            <div class="maxWidth">
              <!-- <NuxtPage /> -->
              <slot />
            </div>
          </v-container>
        </v-main>
      </v-app>
    </v-locale-provider>
  </ClientOnly>
</template>
