<template>
  <BaseModal
    :isOpen="open"
    @close="emit('close')"
    :title="$t('admin.edit_order_modal_title')"
    :subtitle="`#${formatOrderNumber(order.order_number || order.id)}`"
    icon="edit"
    iconColor="bg-orange-50 text-orange-600"
  >
    <div class="space-y-3 pt-2 text-right" dir="rtl">
      <div
        v-for="(item, index) in editableItems"
        :key="item.id || index"
        class="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100"
      >
        <div class="flex-1 min-w-0 pr-1">
          <p class="font-bold text-gray-800 text-sm truncate">{{ item.name }}</p>
          <p class="text-xs text-orange-600 font-bold mt-0.5">
            {{ item.price }} {{ $t("currency") }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            @click="decreaseEditQty(index)"
            class="w-7 h-7 rounded-xl bg-white border border-gray-200 text-gray-600 font-black flex items-center justify-center hover:bg-gray-100 active:scale-95"
          >
            <BaseIcon name="minus" class="w-3.5 h-3.5" />
          </button>
          <span class="w-6 text-center font-black text-sm text-gray-800">{{ item.quantity }}</span>
          <button
            type="button"
            @click="increaseEditQty(index)"
            class="w-7 h-7 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center hover:bg-orange-600 active:scale-95"
          >
            <BaseIcon name="plus" class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            @click="removeEditItem(index)"
            class="w-7 h-7 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors ms-1"
            title="حذف الصنف"
          >
            <BaseIcon name="trash" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div v-if="editableItems.length === 0" class="text-center py-6 text-gray-400 font-bold text-xs">
        لا توجد أصناف في الطلب
      </div>

      <div class="flex justify-between items-center pt-3 border-t border-gray-100 px-1">
        <span class="text-sm font-bold text-gray-500">{{ $t("admin.order_total") }}:</span>
        <span class="text-lg font-black text-orange-600">
          {{ calculatedEditTotal }} {{ $t("currency") }}
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3" dir="rtl">
        <BaseButton variant="secondary" fullWidth @click="emit('close')">
          {{ $t("common.cancel") }}
        </BaseButton>
        <BaseButton
          variant="primary"
          fullWidth
          :loading="isSaving"
          :disabled="editableItems.length === 0"
          @click="saveOrderEdits"
        >
          {{ $t("admin.save_order_changes") }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  open: boolean
  order: Record<string, any>
}>()

const emit = defineEmits<{
  close: []
  saved: [payload: { items: any[]; total_price: number }]
}>()

const { updateOrder } = useOrders()
const editableItems = ref<any[]>([])
const isSaving = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      editableItems.value = (props.order.items || []).map((item: any) => ({ ...item }))
    }
  }
)

const increaseEditQty = (index: number) => {
  if (editableItems.value[index]) editableItems.value[index].quantity++
}

const removeEditItem = (index: number) => {
  editableItems.value.splice(index, 1)
}

const decreaseEditQty = (index: number) => {
  const target = editableItems.value[index]
  if (!target) return
  if (target.quantity > 1) target.quantity--
  else removeEditItem(index)
}

const calculatedEditTotal = computed(() =>
  editableItems.value.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0)
)

const saveOrderEdits = async () => {
  if (editableItems.value.length === 0) return
  isSaving.value = true
  const newTotal = calculatedEditTotal.value
  const newItems = [...editableItems.value]
  const success = await updateOrder(props.order.id, {
    items: newItems,
    total_price: newTotal,
  })
  isSaving.value = false
  if (success) {
    emit('saved', { items: newItems, total_price: newTotal })
    emit('close')
  }
}
</script>
