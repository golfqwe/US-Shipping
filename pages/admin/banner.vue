<script setup lang="ts">
import { useCustomFetch } from '@/composables/useCustomFetch'

import type { utils } from '@/types/utils/index'

definePageMeta({
  middleware: 'checkauth'
})

const config = useRuntimeConfig()

const dialog = ref(false)
const dialogDelete = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const formInput = ref()
const items: utils[] = reactive([])
const files = ref([])

const defaultItem = reactive({
  content: '',
  image: '',
  type: 'banner',
  status: true
})
const editedIndex = ref(-1)
const editedItem = reactive({
  content: '',
  image: '',
  type: 'banner',
  status: true
})

const { data: listItems, refresh } = await useCustomFetch('/api/utils/', {
  method: 'GET',
  params: { type: 'banner' }
})

watch(listItems, (val) => {
  items.length = 0
  Object.assign(items, val)
})

watch(dialog, (val) => {
  val || close()
})
watch(dialogDelete, (val) => {
  val || close()
})
const deleteItem = (item: any) => {
  editedIndex.value = Number(item.id)
  Object.assign(editedItem, item)
  dialogDelete.value = true
}

const deleteItemConfirm = async () => {
  try {
    await useCustomFetch(`/api/utils/${editedIndex.value}`, {
      method: 'delete'
    })

    await useCustomFetch('/api/upload/image/', {
      method: 'delete',
      body: {
        path: editedItem.image
      }
    })

    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
    snackbar.status = true
  } catch (error) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
    snackbar.status = true
  }

  dialogDelete.value = false
  snackbar.status = true
  refresh()
}
const editItem = (item: any) => {
  editedIndex.value = item.id
  Object.assign(editedItem, { ...item, status: item.status === 'active' })
  dialog.value = true
}
const close = async () => {
  dialog.value = false
  await nextTick(() => {
    Object.assign(editedItem, defaultItem)
    files.value = []
    editedIndex.value = -1
  })
}
const save = async () => {
  const { valid } = await formInput.value.validate()

  if (!valid) {
    return
  }
  const formData = new FormData()
  formData.append('path', 'banner')
  files.value.forEach((it, inx) => {
    formData.append('photo' + inx, it, it.name)
  })

  if (editedIndex.value > -1) {
    try {
      let buffer = {
        type: 'banner',
        status: editedItem.status ? 'active' : 'inactive'
      }
      if (files.value.length) {
        const { data } = await useCustomFetch('/api/upload/utils', {
          method: 'post',
          body: formData
        })
        buffer = {
          ...buffer,
          image: data?.value?.pathFile
        }
      }
      await useCustomFetch(
        '/api/utils/' + editedIndex.value,
        {
          method: 'put',
          body: buffer
        }
      )
      await useCustomFetch('/api/upload/image', {
        method: 'delete',
        body: {
          path: editedItem.image
        }
      })
      snackbar.text = 'Save data successfully'
      snackbar.color = 'success'
    } catch (error) {
      snackbar.text = 'Save data failed'
      snackbar.color = 'error'
    }

    snackbar.status = true
    close()
    refresh()
  } else {
    try {
      const { data } = await useCustomFetch('/api/upload/utils', {
        method: 'post',
        body: formData
      })

      await useCustomFetch('/api/utils/', {
        method: 'post',
        body: {
          image: data?.value?.pathFile,
          type: 'banner',
          status: 'active'
        }
      })

      snackbar.text = 'Save data successfully'
      snackbar.color = 'success'
    } catch (error) {
      snackbar.text = 'Save data failed'
      snackbar.color = 'error'
    }
    snackbar.status = true

    close()
    refresh()
  }
}
</script>
<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col> Banner </v-col>
            <v-col cols="auto">
              <v-btn color="info" @click="dialog = true">
                <v-icon start>
                  mdi-plus
                </v-icon>Add
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">
                ::
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                image
              </th>

              <th class="text-subtitle-1 font-weight-bold text-center">
                status
              </th>
              <th class="text-subtitle-1 font-weight-bold text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, id) in items" :key="id" class="month-item">
              <td>
                <p class="text-15 font-weight-medium">
                  {{ item.id }}
                </p>
              </td>
              <td>
                <v-img
                  :src="`${config.public.apiBase}${item.image}`"
                  :lazy-src="`${config.public.apiBase}${item.image}`"
                  height="100%"
                  max-height="350px"
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey-lighten-5"
                      />
                    </v-row>
                  </template>
                </v-img>
              </td>

              <td class="text-center">
                <v-chip
                  :class="{
                    'text-body-1': true,
                    'bg-success': item.status === 'active',
                    'bg-error': item.status === 'inactive',
                  }"
                  color="white"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </td>
              <td class="text-right">
                <v-btn
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-pencil
                  </v-icon> edit
                </v-btn>
                <v-btn
                  size="small"
                  rounded="lg"
                  color="error"
                  @click="deleteItem(item)"
                >
                  <v-icon start dark>
                    mdi-delete
                  </v-icon> delete
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-dialog v-model="dialog" persistent width="800">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex > -1 ? "แก้ไข" : "เพิ่ม" }}Banner</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formInput">
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    v-model="files"
                    variant="outlined"
                    density="compact"
                    accept="image/*"
                    color="primary"
                    prepend-icon="mdi-paperclip"
                    hint="* 970 x 250 pixels,  970 x 450 pixels"
                    persistent-hint
                  >
                    <template #selection="{ fileNames }">
                      <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip
                          size="small"
                          label
                          class="me-2"
                        >
                          {{ fileName }}
                        </v-chip>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col v-show="editedIndex > -1" cols="4">
                  <v-label class="font-weight-bold mb-1">
                    Status
                  </v-label>
                  <v-switch
                    v-model="editedItem.status"
                    color="success"
                    hide-details="auto"
                    inset
                    :label="`${editedItem.status ? 'active' : 'inactive'}`"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <small class="text-red">*indicates required field</small>
          <v-spacer />
          <v-btn color="error" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialogDelete = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.status"
      :timeout="2000"
      :color="snackbar.color"
      location="top right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>
