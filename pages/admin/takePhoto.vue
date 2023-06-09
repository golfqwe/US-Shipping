<script setup lang="ts">
import type { tracking } from '@/types/tracking/index'
definePageMeta({
  middleware: 'checkauth'
})

const config = useRuntimeConfig()
const userInfo = useUserStore()
const router = useRouter()
if (localStorage.getItem('userInfo')) {
  userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
}

const dialog = ref(false)
const dialogImage = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const items: tracking[] = reactive([])
const files = ref([])

let editedTracking = reactive({})

const { data: listItems, refresh } = await useLazyFetch('/api/trackings/', {
  baseURL: config.public.apiBase,
  method: 'GET',
  query: { status: 'pending,waitpayment' },
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  },
  onResponseError ({ response }) {
    if (response.status === 401) {
      router.push({ path: '/login' })
    }
  }
})

watch(listItems, (val) => {
  items.length = 0
  Object.assign(items, val)
})

watch(dialog, (val) => {
  val || close()
})

const editItem = (item: any) => {
  editedTracking = item
  dialog.value = true
}
const selectItem = (item: any) => {
  editedTracking = item
  dialogImage.value = true
}
const close = async () => {
  dialog.value = false
  await nextTick(() => {
    Object.assign(editedTracking, {})
  })
}
const save = async () => {
  const formData = new FormData()
  formData.append('trackingNumber', editedTracking.trackingNumber)
  formData.append('trackingId', editedTracking.id)
  files.value.forEach((it, inx) => {
    formData.append('photo' + inx, it, it.name)
  })

  const { error } = await useFetch('/api/upload/trackings', {
    baseURL: config.public.apiBase,
    method: 'post',
    body: formData,
    headers: {
      authorization: 'Bearer ' + userInfo?.value?.token
    }
  })

  if (error.value) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
  } else {
    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
  }
  snackbar.status = true

  close()
  refresh()
}

</script>
<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col> บันทึกรูปพัสดุ </v-col>
          </v-row>
        </v-card-title>
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">
                ::
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Tracking No
              </th>
              <th class="text-subtitle-1 font-weight-bold text-center">
                จำนวนกล่อง
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                วันที่แจ้งส่ง
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                วันที่สินค้าถึงโกดัง
              </th>
              <th class="text-subtitle-1 font-weight-bold text-right">
                ประเภทจัดส่ง
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                สถานะ
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
                <p class="text-15 font-weight-medium">
                  {{ item.trackingNumber }}
                </p>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ 1 }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted">
                  {{
                    new Date(item?.createdAt).toLocaleString("th-TH")
                  }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted">
                  {{
                    item?.receiveDate ? new Date(item?.receiveDate).toLocaleString("th-TH") : '-'
                  }}
                </h6>
              </td>

              <td>
                <h6 class="text-body-1 text-muted text-center">
                  <v-icon
                    start
                    size="x-large"
                    :color="item.carrier === 'Air' ? 'success' : 'blue'"
                  >
                    {{
                      item.carrier === "Air"
                        ? "  mdi-airplane"
                        : "   mdi-sail-boat"
                    }}
                  </v-icon>
                  {{ item.carrier }}
                </h6>
              </td>
              <td>
                <v-chip
                  :color="`${
                    item?.status?.code === 'waitpayment'
                      ? 'info'
                      : item?.status?.code === 'success'
                        ? 'success'
                        : ''
                  }`"
                >
                  {{ item?.status?.desc }}
                </v-chip>
              </td>

              <td class="text-right">
                <v-btn
                  v-show=" item?.status?.code === 'pending'"
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-upload
                  </v-icon> อัปโหลด
                </v-btn>
                <v-btn
                  v-show=" item?.status?.code === 'waitpayment'"
                  size="small"
                  rounded="lg"
                  color="success"
                  @click="selectItem(item)"
                >
                  <v-icon start dark>
                    mdi-eye
                  </v-icon> ดูรูป
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card>
        <v-card-title>
          <span class="text-h5">รูปพัสดุ</span>
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="files"
            variant="outlined"
            density="compact"
            accept="image/*"
            color="primary"
            multiple
            prepend-icon="mdi-paperclip"
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
        </v-card-text>
        <v-card-actions>
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

    <v-dialog v-model="dialogImage" max-width="750">
      <v-card>
        <v-card-title>
          <span class="text-h5">รูปพัสดุ</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="(item,inx) in editedTracking.images.split(',')"
              :key="inx"
            >
              <v-img
                :src="`${config.public.apiBase}${item}`"
                :lazy-src="`${config.public.apiBase}${item}`"
                cover
                width="100%"
                class="bg-grey-lighten-2"
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
            </v-col>
          </v-row>
        </v-card-text>
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
