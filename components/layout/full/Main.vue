<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { Menu2Icon } from 'vue-tabler-icons'
import sidebarItems from '@/components/layout/full/vertical-sidebar/sidebarItem'
const sidebarMenu = shallowRef(sidebarItems)
const sDrawer = ref(true)
</script>

<template>
  <!------Sidebar-------->
  <v-navigation-drawer v-model="sDrawer" left elevation="0" app class="leftSidebar">
    <!---Logo part -->
    <div class="px-5">
      <LayoutFullLogo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <div>
      <perfect-scrollbar class="scrollnavbar">
        <v-list class="pa-6">
          <!---Menu Loop -->
          <template v-for="(item, i) in sidebarMenu">
            <!---Item Sub Header -->
            <LayoutFullVerticalSidebarNavGroup v-if="item.header" :key="item.title" :item="item" />

            <!---Single Item-->
            <LayoutFullVerticalSidebarNavItem v-else :key="i" :item="item" class="leftPadding" />
            <!---End Single Item-->
          </template>
        </v-list>
        <!-- <div class="pa-4">
          <LayoutFullVerticalSidebarExtraBox />
        </div> -->
      </perfect-scrollbar>
    </div>
  </v-navigation-drawer>
  <!------Header-------->
  <v-app-bar elevation="0" height="70">
    <div class="d-flex align-center justify-space-between w-100">
      <div>
        <v-btn
          class="hidden-lg-and-up ms-md-3 ms-sm-5 ms-3 text-muted"
          icon
          variant="flat"
          size="small"
          @click="sDrawer = !sDrawer"
        >
          <Menu2Icon size="20" stroke-width="1.5" />
        </v-btn>
        <!-- Notification -->
        <LayoutFullVerticalHeaderNotificationDD />
      </div>
      <div>
        <!-- User Profile -->
        <LayoutFullVerticalHeaderProfileDD />
      </div>
    </div>
  </v-app-bar>
</template>
