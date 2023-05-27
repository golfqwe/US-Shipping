<script setup lang="ts">
const title = ref('Us-shipping - Admin')
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Admin`
      : 'Us-shipping - Admin manage'
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
