<template>
  <div class="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100">

    <!-- Add User Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" @click="closeModal" />
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full relative z-[110] shadow-2xl border border-gray-100" dir="rtl">
          <h2 class="text-xl font-black text-gray-900 mb-1">{{ $t('admin.users_page.add_user_title') }}</h2>
          <p class="text-gray-400 text-sm mb-6">{{ $t('admin.users_page.add_user_msg') }}</p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('admin.users_page.email') }}</label>
              <BaseInput
                v-model="newUser.email"
                type="email"
                placeholder="example@email.com"
                class="!border !border-gray-200 !py-3 !px-4 !bg-white !rounded-2xl shadow-none"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('admin.users_page.password') }}</label>
              <BaseInput
                v-model="newUser.password"
                type="password"
                placeholder="••••••••"
                class="!border !border-gray-200 !py-3 !pr-4 !bg-white !rounded-2xl shadow-none"
              />
            </div>

            <p class="text-xs text-gray-400 bg-gray-50 rounded-2xl p-3">
              {{ $t('admin.users_page.auto_link_msg') }}
            </p>


          </div>

          <div class="flex gap-3 mt-8">
            <button
              @click="closeModal"
              class="flex-1 py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
            >
              {{ $t('admin.users_page_cancel') }}
            </button>
            <button
              @click="createUser"
              :disabled="creating"
              class="flex-1 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {{ creating ? $t('admin.users_page.creating_account') : $t('admin.users_page.create_account') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete User Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" @click="closeDeleteModal" />
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full relative z-[110] shadow-2xl border border-gray-100" dir="rtl">
          <div class="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
            <span class="text-2xl font-black text-red-500 line-through">!</span>
          </div>
          <h2 class="text-xl font-black text-red-600 mb-1">{{ $t('admin.users_page.delete_user_title') }}</h2>
          <p class="text-gray-500 text-sm mb-6">{{ $t('admin.users_page.delete_user_confirm_pt1') }} <span class="font-bold text-gray-900">{{ userToDelete?.email || userToDelete?.full_name || $t('admin.users_page.default_user') }}</span> {{ $t('admin.users_page.delete_user_confirm_pt2') }}</p>

          <div class="flex gap-3 mt-8">
            <button
              @click="closeDeleteModal"
              class="flex-1 py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
            >
              {{ $t('admin.users_page_cancel') }}
            </button>
            <button
              @click="deleteUser"
              :disabled="deleting"
              class="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ deleting ? $t('admin.users_page.deleting') : $t('admin.users_page.delete_account') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Page Header -->
    <div class="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-5 mb-8 w-full">
      <div class="flex flex-row items-center gap-3 w-full md:w-auto">
         <div class="bg-orange-50 flex items-center justify-center text-orange-600 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap">
          {{ $t('admin.users_page.total') }} {{ users.length }}
        </div>
        <button
          @click="showAddModal = true"
          class="flex-1 md:flex-none justify-center flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-sm shadow-orange-100"
        >
          <span class="text-lg leading-none">+</span>
          {{ $t('admin.users_page.add_user') }}
        </button>
       
      </div>
      <div class="w-full text-right">
        <h1 class="text-2xl font-black text-gray-900">{{ $t('admin.users_page.users_title') }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ $t('admin.users_page.users_subtitle') }}</p>
      </div>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-right border-separate border-spacing-y-2" dir="rtl">
        <thead>
          <tr class="text-gray-400 text-sm">
            <th class="pb-4 pr-6 font-medium text-right whitespace-nowrap">{{ $t('admin.users_page.user') }}</th>
            <th class="pb-4 font-medium text-center whitespace-nowrap">{{ $t('admin.users_page.current_role') }}</th>
            <th class="pb-4 font-medium text-left pl-6 whitespace-nowrap">{{ $t('admin.users_page.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="bg-gray-50 hover:bg-gray-100 transition-colors group">
            <td class="py-4 pr-6 rounded-r-2xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-orange-600 shadow-sm border border-orange-50">
                  {{ (user.email || user.full_name || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-bold text-gray-900">
                    {{ user.full_name || user.email?.split('@')[0] || $t('admin.users_page.default_user') }}
                  </div>
                  <div class="text-xs text-gray-400">{{ user.business_name_ar || users.find(u => u.role === 'super_admin')?.business_name_ar || $t('admin.users_page.restaurant_not_found') }}</div>
                </div>
              </div>
            </td>

            <td class="py-4 text-center">
              <span :class="getRoleClass(user.role)" class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                {{ user.role }}
              </span>
            </td>

            <td class="py-4 pl-6 text-left rounded-l-2xl">
              <div class="flex justify-end gap-2">
                <button
                  v-if="user.role !== 'super_admin'"
                  @click="confirmDeleteUser(user)"
                  class="bg-white text-red-600 border border-red-50 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                >
                  {{ $t('admin.users_page.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="users.length === 0" class="py-20 text-center">
      <p class="text-gray-400">{{ $t('admin.users_page.no_users') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'superadmin',
  layout: 'admin'
})

const client = useSupabaseClient()
const { $toast } = useNuxtApp()
const { t } = useI18n()
const users = ref<any[]>([])

// Modal state
const showAddModal = ref(false)
const creating = ref(false)
const newUser = ref({ email: '', password: '', business_name_ar: '', role: 'admin' })

// Delete state
const showDeleteModal = ref(false)
const deleting = ref(false)
const userToDelete = ref<any>(null)

const closeModal = () => {
  showAddModal.value = false
  newUser.value = { email: '', password: '', business_name_ar: '', role: 'admin' }
}

const confirmDeleteUser = (user: any) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

// Create user via secure server API
const createUser = async () => {
  if (!newUser.value.email || !newUser.value.password) {
    $toast.error(t('admin.users_page.email_pass_req'))
    return
  }
  creating.value = true
  try {
    await $fetch('/api/create-user', {
      method: 'POST',
      body: newUser.value,
    })
    $toast.success(t('admin.users_page.create_success'))
    closeModal()
    await fetchUsers()
  } catch (err: any) {
    $toast.error(err?.data?.message || t('admin.users_page.create_error'))
  } finally {
    creating.value = false
  }
}

// Fetch users from profiles table
const fetchUsers = async () => {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true })

  if (error) {
    console.error(error)
    $toast.error(t('admin.users_page.fetch_users_error'))
  } else {
    users.value = data
  }
}

// Delete user via secure API (auth and cascade profiles, items)
const deleteUser = async () => {
  if (!userToDelete.value) return
  deleting.value = true
  try {
    await $fetch('/api/delete-user', {
      method: 'DELETE',
      body: { profileId: userToDelete.value.id },
    })
    $toast.success(t('admin.users_page.delete_success'))
    closeDeleteModal()
    await fetchUsers()
  } catch (err: any) {
    console.error('Delete error:', err)
    $toast.error(err?.data?.message || t('admin.users_page.delete_error'))
  } finally {
    deleting.value = false
  }
}

// Badge styling
const getRoleClass = (role: string) => {
  switch (role) {
    case 'super_admin': return 'bg-purple-100 text-purple-600'
    case 'admin': return 'bg-blue-100 text-blue-600'
    default: return 'bg-gray-200 text-gray-500'
  }
}

onMounted(() => {
  fetchUsers()
})
</script>