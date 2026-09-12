<template>
  <div class="max-w-3xl mx-auto py-4 md:py-8" dir="rtl">
    <div
      class="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-50"
    >
      <div class="flex items-center gap-4 mb-8">
        <div
          class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center"
        >
          <BaseIcon name="settings" class="w-7 h-7 text-orange-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ $t("admin.settings_title") }}
          </h2>
          <p class="text-sm text-gray-400 font-bold mt-1">
            {{ $t("admin.settings_subtitle") }}
          </p>
        </div>
      </div>

      <!-- Current Subscription & Plan Card -->
      <div class="mb-8 p-5 rounded-3xl border border-gray-100 bg-gradient-to-l from-gray-50/80 via-white to-orange-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0"
            :class="isPro ? 'bg-amber-100 text-amber-700' : isBasic ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-600'"
          >
            {{ isPro ? '👑' : isBasic ? '⚡' : '🎁' }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-gray-900 text-base md:text-lg">
                {{ $t(`plans.${currentPlan.id || 'free'}_name`) }}
              </h3>
              <span
                class="text-xs px-2.5 py-0.5 rounded-full font-black"
                :class="isPro ? 'bg-amber-100 text-amber-800' : isBasic ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'"
              >
                {{ isFree ? $t("plans.free_trial_badge") : $t("plans.active_badge") }}
              </span>
            </div>
            <p class="text-xs text-gray-500 font-medium mt-1">
              <template v-if="isFree">
                {{ $t("plans.allowed_limit", { items: currentPlan.max_items, categories: currentPlan.max_categories }) }}
              </template>
              <template v-else>
                {{ $t("plans.unlimited_items_cats") }} • {{ $t("plans.all_features_active") }}
              </template>
            </p>
          </div>
        </div>

        <button
          v-if="!isPro"
          type="button"
          @click="openUpgradeForFeature($t('plans.full_upgrade_title'), $t('plans.full_upgrade_badge'), $t('plans.full_upgrade_msg'))"
          class="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs md:text-sm py-2.5 px-5 rounded-xl shadow-md shadow-orange-500/15 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          ⚡ {{ $t("plans.upgrade_now") }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- اسم المطعم -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.business_name"
            :label="$t('admin.restaurant_name')"
            :placeholder="$t('admin.restaurant_name_placeholder')"
          />
        </div>

        <!-- Logo Upload Section -->
        <!-- <div class="md:col-span-2 mb-4">
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1"
            >شعار المطعم</label
          >
          <div class="flex items-center gap-4">
            <div
              class="relative w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 shrink-0"
            >
              <template v-if="logoUploading">
                <div
                  class="absolute inset-0 bg-white/50 flex items-center justify-center z-10"
                >
                  <div
                    class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>
              </template>
              <img
                v-if="form.logo"
                :src="form.logo"
                class="w-full h-full object-cover"
                :class="{ 'opacity-50': logoUploading }"
              />
              <BaseIcon v-else name="photo" class="w-8 h-8 opacity-20" />
            </div>
            <label class="cursor-pointer">
              <BaseButton
                variant="outline"
                size="sm"
                :loading="logoUploading"
                @click="$refs.logoInput.click()"
              >
                {{ $t("admin.choose_logo") }}
              </BaseButton>
              <input
                ref="logoInput"
                type="file"
                class="hidden"
                @change="uploadLogo"
                accept="image/*"
                :disabled="logoUploading"
              />
            </label>
          </div>
        </div> -->

        <!-- رابط المنيو -->
        <div class="md:col-span-2">
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1">{{
            $t("admin.menu_slug")
          }}</label>
          <div
            class="flex items-center bg-gray-50 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-orange-500 transition-all shadow-sm"
            dir="ltr"
          >
            <span class="text-gray-400 text-sm font-bold opacity-60"
              >getmenujet.com/menu/</span
            >
            <input
              v-model="form.slug"
              placeholder="my-restaurant"
              class="flex-1 py-4 bg-transparent border-none outline-none font-bold placeholder:text-gray-300 text-sm"
            />
          </div>
          <p
            class="text-[10px] text-amber-500 font-bold mt-3 px-1 flex items-center gap-1.5"
          >
            <BaseIcon name="alert" class="w-3.5 h-3.5" />
            {{ $t("admin.slug_qr_warning") }}
          </p>

          <!-- QR Code Section -->
          <div
            v-if="form.slug"
            class="mt-4 flex flex-col sm:flex-row items-center gap-5 bg-orange-50/50 p-5 rounded-3xl border border-orange-100/50 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <div
              class="bg-white p-3 rounded-2xl shadow-sm border border-orange-50 shrink-0"
            >
              <img :src="qrUrl" class="w-24 h-24" alt="Menu QR Code" />
            </div>
            <div class="flex-1 text-center sm:text-right">
              <h4 class="font-bold text-gray-800 text-sm mb-1">
                {{ $t("admin.qr_code_title") }}
              </h4>
              <p
                class="text-[10px] text-gray-400 font-bold leading-relaxed mb-4"
              >
                {{ $t("admin.qr_code_subtitle") }}
              </p>
              <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                <BaseButton
                  variant="primary"
                  size="sm"
                  icon="copy"
                  @click="copyMenuUrl"
                  class="!text-[10px] !px-5 !py-2.5"
                >
                  {{ $t("admin.copy_link") }}
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="sm"
                  icon="download"
                  @click="downloadQr"
                  class="!text-[10px] !px-5 !py-2.5 !bg-white"
                >
                  {{ $t("admin.download_qr") }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- رقم الواتساب -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.whatsapp_number"
            :label="$t('admin.whatsapp_number')"
            :placeholder="$t('admin.whatsapp_placeholder')"
            icon="phone"
          />
        </div>

        <!-- Branding & Colors -->
        <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
          <div class="flex items-center gap-3 mb-4 px-1">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <BaseIcon name="settings" class="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <label class="text-sm font-bold text-gray-800 block">{{ $t("cart.primary_color_label") }}</label>
              <p class="text-[10px] text-gray-400 font-bold mt-1">{{ $t("cart.primary_color_subtitle") }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
            <div class="flex flex-wrap gap-3 mb-5">
              <button 
                v-for="color in ['#ea580c', '#2563eb', '#16a34a', '#7c3aed', '#dc2626', '#1f2937']" 
                :key="color"
                @click="form.primary_color = color"
                class="w-10 h-10 rounded-full border-4 transition-all"
                :style="{ backgroundColor: color, borderColor: form.primary_color === color ? 'white' : 'transparent' }"
                :class="{ 'ring-2 ring-gray-200': form.primary_color === color }"
              ></button>
              
              <!-- Custom Color Picker -->
              <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                <input 
                  type="color" 
                  v-model="form.primary_color"
                  class="absolute inset-0 w-[150%] h-[150%] cursor-pointer -translate-x-1/4 -translate-y-1/4"
                />
                <BaseIcon name="plus" class="w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div class="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 max-w-[200px]">
              <div class="w-8 h-8 rounded-lg shadow-sm" :style="{ backgroundColor: form.primary_color }"></div>
              <input 
                v-model="form.primary_color" 
                type="text" 
                class="bg-transparent border-none outline-none font-black text-sm text-gray-700 w-full"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <!-- Order ID Reset Settings -->
        <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
          <div class="flex items-center gap-3 mb-4 px-1">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <BaseIcon name="settings" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <label class="text-sm font-bold text-gray-800 block">{{ $t("cart.order_id_reset_title") }}</label>
              <p class="text-[10px] text-gray-400 font-bold mt-1">{{ $t("cart.order_id_reset_subtitle") }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 max-w-md">
            <button 
              v-for="type in ['shift', 'daily']" 
              :key="type"
              @click="form.order_reset_type = type"
              :class="[
                'py-3.5 px-3 rounded-2xl font-bold text-xs transition-all border-2 text-center flex items-center justify-center gap-2',
                form.order_reset_type === type 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/10' 
                  : 'bg-white text-gray-500 border-transparent hover:border-blue-200'
              ]"
            >
              <span>{{ type === 'shift' ? '⏱️' : '📅' }}</span>
              <span>{{ $t(`cart.reset_${type}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Restaurant Shifts Section -->
        <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <BaseIcon name="clock" class="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <label class="text-sm font-bold text-gray-800 block">{{ $t("shifts.shifts_settings_title") }}</label>
                <p class="text-xs text-gray-400 font-medium">{{ $t("shifts.shifts_settings_desc") }}</p>
              </div>
            </div>
            <span class="text-[10px] bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg font-black">
              {{ restaurantShiftsList.length }} {{ $t("shifts.shift_name") }}
            </span>
          </div>

          <!-- Add New Shift Inputs -->
          <div class="flex flex-col sm:flex-row gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div class="flex-1 w-full">
              <label class="text-[10px] font-bold text-gray-400 px-1 mb-1 block">{{ $t("shifts.shift_name") }}</label>
              <BaseInput v-model="newShiftForm.shift_name" :placeholder="$t('shifts.general_shift')" />
            </div>
            <div class="w-full sm:w-36">
              <label class="text-[10px] font-bold text-gray-400 px-1 mb-1 block">{{ $t("shifts.start_time") }}</label>
              <input type="time" v-model="newShiftForm.start_time" class="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
            </div>
            <div class="w-full sm:w-36">
              <label class="text-[10px] font-bold text-gray-400 px-1 mb-1 block">{{ $t("shifts.end_time") }}</label>
              <input type="time" v-model="newShiftForm.end_time" class="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
            </div>
            <BaseButton
              variant="primary"
              icon="plus"
              @click="handleAddNewShift"
              class="!w-14 !h-12 !p-0 shrink-0 mb-1"
            />
          </div>

          <!-- Defined Shifts Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div
              v-for="s in restaurantShiftsList"
              :key="s.id"
              class="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-xs flex items-center justify-between group hover:border-orange-200 transition-all relative"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 font-black text-sm">
                  ⏱️
                </div>
                <div>
                  <p class="font-black text-sm text-gray-800">{{ s.shift_name }}</p>
                  <p class="text-xs font-bold text-gray-400 mt-0.5" dir="ltr">
                    {{ s.start_time.slice(0, 5) }} - {{ s.end_time.slice(0, 5) }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                @click="handleRemoveShift(s.id)"
                class="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <BaseIcon name="trash" class="w-4 h-4" />
              </button>
            </div>

            <div v-if="restaurantShiftsList.length === 0" class="col-span-full py-8 flex flex-col items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl text-xs bg-gray-50/30">
              <span class="text-2xl mb-2">⏱️</span>
              {{ $t("shifts.no_shifts_defined") }}
            </div>
          </div>
        </div>

        <!-- Restaurant Status Toggle -->
        <!-- Restaurant Availability Section -->
        <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
          <div class="flex items-center gap-3 mb-6 px-1">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <BaseIcon name="clock" class="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <label class="text-sm font-bold text-gray-800 block">{{ $t('admin.availability_title') }}</label>
              <p class="text-[10px] text-gray-400 font-bold mt-1">{{ $t('admin.availability_subtitle') }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Manual Toggle -->
            <BaseToggle
              v-model="form.is_active"
              :label="$t('admin.restaurant_status_label')"
              class="!bg-white !border !border-gray-100 shadow-sm"
            />

            <!-- Automated Toggle -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <BaseToggle
                v-model="form.automated_hours_enabled"
                :label="$t('admin.automated_hours_label')"
                :locked="!can('allow_custom_hours')"
                :badge="$t('plans.pro_badge_short')"
                @lock-click="openUpgradeForFeature($t('plans.feat_automated_hours'), $t('plans.pro_badge_short'), $t('plans.hours_modal_msg'))"
                class="!bg-transparent"
              />
              
              <div v-if="form.automated_hours_enabled && can('allow_custom_hours')" class="px-5 pb-5 pt-2 border-t border-gray-50 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300" dir="ltr">
                <div class="flex-1 flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{{ $t('admin.opening_time_label') }}</label>
                  <input type="time" v-model="form.opening_time" class="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
                <div class="flex-1 flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{{ $t('admin.closing_time_label') }}</label>
                  <input type="time" v-model="form.closing_time" class="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Store Features Settings -->
        <div class="md:col-span-2 pt-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseToggle
              v-model="form.show_table_number"
              :label="$t('cart.table_number_setting_label')"
              :locked="!can('allow_tables')"
              :badge="$t('plans.pro_badge_short')"
              @lock-click="openUpgradeForFeature($t('plans.feat_tables'), $t('plans.pro_badge_short'), $t('plans.tables_modal_msg'))"
              class="!bg-gray-50/50 !border !border-gray-100"
            />
            <BaseToggle
              v-model="form.show_queue_number"
              :label="$t('cart.queue_number_setting_label')"
              :locked="!can('allow_tables')"
              :badge="$t('plans.pro_badge_short')"
              @lock-click="openUpgradeForFeature($t('plans.feat_queue'), $t('plans.pro_badge_short'), $t('plans.queue_modal_msg'))"
              class="!bg-gray-50/50 !border !border-gray-100"
            />
            <BaseToggle
              v-model="form.whatsapp_ordering_enabled"
              :label="$t('plans.enable_whatsapp_ordering')"
              :locked="!can('allow_whatsapp_orders')"
              :badge="$t('plans.pro_badge_short')"
              @lock-click="openUpgradeForFeature($t('plans.feat_whatsapp_ordering'), $t('plans.pro_badge_short'), $t('plans.whatsapp_modal_msg'))"
              class="!bg-gray-50/50 !border !border-gray-100"
            />
            <BaseToggle
              v-model="form.show_phone_number"
              :label="$t('plans.enable_phone_number')"
              class="!bg-gray-50/50 !border !border-gray-100"
            />
          </div>
        </div>

        <!-- Delete Category Confirmation Modal -->
        <BaseModal
          :isOpen="showDeleteCategoryModal"
          @close="showDeleteCategoryModal = false"
          :title="$t('admin.delete_category_title')"
          :subtitle="$t('admin.delete_category_subtitle')"
          icon="trash"
          iconColor="bg-red-50 text-red-600"
          :showClose="false"
          max-width="max-w-sm"
        >
          <template #footer>
            <div class="flex gap-3">
              <BaseButton
                variant="secondary"
                fullWidth
                @click="showDeleteCategoryModal = false"
              >
                {{ $t("admin.cancel") }}
              </BaseButton>
              <BaseButton
                variant="danger"
                fullWidth
                @click="confirmRemoveCategory"
              >
                {{ $t("admin.confirm_delete") }}
              </BaseButton>
            </div>
          </template>
        </BaseModal>

        <!-- Upgrade Plan Modal -->
        <UpgradeModal
          :isOpen="showUpgradeModal"
          :limitType="upgradeModalConfig.limitType"
          :title="upgradeModalConfig.title"
          :badgeText="upgradeModalConfig.badgeText"
          :message="upgradeModalConfig.message"
          :currentCount="form.categories.length"
          :maxCount="maxCategories"
          :businessName="form.business_name || profile?.business_name || ''"
          @close="showUpgradeModal = false"
        />

        <!--  Categories -->
        <div class="md:col-span-2 pt-4">
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-bold text-gray-700">{{
                $t("admin.menu_sections")
              }}</label>
              <span
                class="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-black"
                >{{ form.categories.length }} / {{ maxCategories === -1 ? '∞' : maxCategories }}
                {{ $t("admin.sections_count") }}</span
              >
            </div>

            <button
              v-if="isCategoryLimitReached || isPlanFree"
              type="button"
              @click="openUpgradeForCategories"
              class="text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              ⚡ {{ $t("plans.upgrade_btn") }}
            </button>
          </div>

          <div class="flex gap-3 items-end">
            <BaseInput
              v-model="newCategory"
              @keyup.enter="addCategory"
              :placeholder="$t('admin.add_category_placeholder')"
            />
            <BaseButton
              variant="primary"
              icon="plus"
              @click="addCategory"
              class="!w-14 !h-14 !p-0 !grow-0 shrink-0"
            />
          </div>

          <div
            class="flex flex-wrap gap-2 mt-6 min-h-[50px] p-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200"
          >
            <!-- Skeleton for settings categories during loading -->
            <template v-if="profileLoading || !profile">
              <div
                v-for="i in 5"
                :key="i"
                class="w-20 h-10 bg-gray-200 animate-pulse rounded-xl"
              ></div>
            </template>

            <template v-else>
              <div
                v-for="(cat, index) in form.categories"
                :key="index"
                class="bg-white text-gray-700 px-3 py-2 rounded-xl flex items-center gap-2 border border-gray-100 shadow-sm animate-in zoom-in duration-200 group hover:border-orange-200 overflow-hidden"
              >
                <!-- Move Controls -->
                <div
                  class="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1"
                >
                  <button
                    @click="moveCategory(index, -1)"
                    v-if="index > 0"
                    class="text-gray-300 hover:text-orange-500 p-0.5 transition-colors"
                  >
                    <BaseIcon name="arrow-up" class="w-2.5 h-2.5" />
                  </button>
                  <button
                    @click="moveCategory(index, 1)"
                    v-if="index < form.categories.length - 1"
                    class="text-gray-300 hover:text-orange-500 p-0.5 transition-colors"
                  >
                    <BaseIcon name="arrow-down" class="w-2.5 h-2.5" />
                  </button>
                </div>

                <!-- Item Content -->
                <div class="flex items-center gap-2">
                  <template v-if="editingCategoryIndex === index">
                    <input
                      v-model="editingCategoryName"
                      @blur="saveCategoryName(index)"
                      @keyup.enter="saveCategoryName(index)"
                      @keyup.esc="cancelEditCategory"
                      ref="editInput"
                      class="bg-gray-50 border-none outline-none font-bold text-sm w-24 px-1 rounded text-center"
                      autofocus
                    />
                  </template>
                  <template v-else>
                    <span
                      class="font-bold text-sm cursor-pointer hover:text-orange-600 transition-colors"
                      @click="startEditCategory(index)"
                    >
                      {{ cat }}
                    </span>
                  </template>
                </div>

                <!-- Delete Button -->
                <button
                  @click="initiateRemoveCategory(index)"
                  class="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center p-1"
                >
                  <BaseIcon name="close" class="w-3.5 h-3.5" />
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- Delivery Areas -->
        <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4 relative">
          <!-- Smart Lock Overlay for Free & Basic Plans -->
          <div
            v-if="!can('allow_branches')"
            class="absolute inset-0 bg-white/85 backdrop-blur-[3px] z-20 rounded-3xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-amber-200/90 shadow-xs"
          >
            <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-xs">
              👑
            </div>
            <h4 class="font-black text-gray-900 text-base mb-1">
              {{ $t("plans.delivery_lock_title") }}
            </h4>
            <p class="text-xs text-gray-500 font-medium max-w-sm mb-4 leading-relaxed">
              {{ $t("plans.delivery_lock_desc") }}
            </p>
            <button
              type="button"
              @click="openUpgradeForFeature($t('plans.feat_delivery'), $t('plans.pro_badge_short'), $t('plans.delivery_modal_msg'))"
              class="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs py-2.5 px-6 rounded-xl shadow-md shadow-orange-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              ⚡ {{ $t("plans.delivery_lock_btn") }}
            </button>
          </div>

          <div class="flex items-center gap-3 mb-4 px-1">
            <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <BaseIcon name="map-pin" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <label class="text-sm font-bold text-gray-800 block">{{ $t("admin.delivery_areas_title") }}</label>
              <span class="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 mt-1 rounded font-bold inline-flex items-center gap-1"><BaseIcon name="check" class="w-2 h-2" /> {{ form.delivery_areas?.length || 0 }} {{ $t("admin.area_registered") }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div class="flex-1 w-full">
              <BaseInput v-model="newDeliveryArea.name" @keyup.enter="addDeliveryArea" :placeholder="$t('admin.area_name_placeholder')" />
            </div>
            <div class="w-full sm:w-32">
              <BaseInput v-model.number="newDeliveryArea.price" @keyup.enter="addDeliveryArea" type="number" :placeholder="$t('admin.area_price_placeholder')" />
            </div>
            <BaseButton
              variant="primary"
              icon="plus"
              @click="addDeliveryArea"
              class="!w-14 !h-14 !p-0 shrink-0 mb-1 !bg-green-500 hover:!bg-green-600 !shadow-green-200"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div
              v-for="(area, index) in form.delivery_areas"
              :key="index"
              class="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all relative overflow-hidden"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <BaseIcon name="map-pin" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p class="font-bold text-sm text-gray-800">{{ area.name }}</p>
                  <p class="text-xs font-black text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded inline-block">{{ area.price }} {{ $t("admin.currency") }}</p>
                </div>
              </div>
              <button
                @click="removeDeliveryArea(index)"
                class="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"
              >
                <BaseIcon name="trash" class="w-4 h-4" />
              </button>
            </div>
            
            <div v-if="!form.delivery_areas || form.delivery_areas.length === 0" class="col-span-full py-10 flex flex-col items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl text-sm bg-gray-50/30">
              <BaseIcon name="map-pin" class="w-10 h-10 mb-3 opacity-20" />
              {{ $t("admin.no_areas_msg") }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <BaseButton
          variant="primary"
          size="lg"
          fullWidth
          :loading="actionLoading"
          @click="saveSettings"
          class="!font-bold"
        >
          {{ $t("admin.save_settings") }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const { ownerId } = useAuthUser();
const { $toast } = useNuxtApp();
const { t } = useI18n();

// Composables
const {
  profile,
  loading: profileLoading,
  loading: actionLoading,
  uploading: logoUploading,
  fetchProfile,
  updateProfile,
  uploadLogo: uploadLogoAction,
} = useSettings();

const { deleteItemsByCategory, updateItemsCategory } = useMenu();
const { maxCategories: planMaxCategories, isFree: isPlanFree, isBasic, isPro, currentPlan, can } = usePlan();

const showUpgradeModal = ref(false);
const upgradeModalConfig = ref({
  limitType: "categories",
  title: "",
  badgeText: "",
  message: "",
});

const openUpgradeForCategories = () => {
  upgradeModalConfig.value = {
    limitType: "categories",
    title: t("plans.modal_default_title"),
    badgeText: t("plans.reached_limit"),
    message: "",
  };
  showUpgradeModal.value = true;
};

const openUpgradeForFeature = (featureName, badge = "", customMsg = "") => {
  upgradeModalConfig.value = {
    limitType: "general",
    title: t("plans.feature_upgrade_title", { feature: featureName }),
    badgeText: badge || t("plans.pro_badge_short"),
    message: customMsg || t("plans.feature_upgrade_msg", { feature: featureName }),
  };
  showUpgradeModal.value = true;
};

const maxCategories = computed(() => {
  if (profile.value?.max_categories !== undefined && profile.value?.max_categories !== null) {
    return profile.value.max_categories;
  }
  return planMaxCategories.value;
});
const isCategoryLimitReached = computed(() => {
  if (maxCategories.value === -1) return false;
  return (form.value.categories?.length || 0) >= maxCategories.value;
});

const newCategory = ref("");
const newDeliveryArea = ref({ name: "", price: "" });

// Shifts Logic
const {
  shifts: restaurantShiftsList,
  fetchShifts: loadRestaurantShifts,
  addShift: createRestaurantShift,
  deleteShift: removeRestaurantShift,
} = useShifts();

const newShiftForm = ref({
  shift_name: "",
  start_time: "08:00",
  end_time: "16:00",
});

const handleAddNewShift = async () => {
  if (!ownerId.value) return;
  if (!newShiftForm.value.shift_name.trim()) {
    return $toast.error(t("admin.error_fields"));
  }
  await createRestaurantShift(ownerId.value, {
    shift_name: newShiftForm.value.shift_name.trim(),
    start_time: newShiftForm.value.start_time,
    end_time: newShiftForm.value.end_time,
  });
  newShiftForm.value.shift_name = "";
};

const handleRemoveShift = async (shiftId) => {
  await removeRestaurantShift(shiftId);
};

watch(
  ownerId,
  (id) => {
    if (id) {
      loadRestaurantShifts(id);
    }
  },
  { immediate: true }
);

const form = ref({
  business_name: "",
  slug: "",
  whatsapp_number: "",
  categories: [],
  delivery_areas: [],
  logo: "",
  is_active: true,
  order_reset_type: "shift",
  primary_color: "#ea580c",
  show_table_number: false,
  show_queue_number: false,
  whatsapp_ordering_enabled: true,
  show_phone_number: true,
  automated_hours_enabled: false,
  opening_time: "09:00",
  closing_time: "23:00",
});

// Initialize Data
watch(
  ownerId,
  async (newId) => {
    if (newId) {
      const data = await fetchProfile(newId);
      if (data) {
        form.value = {
          business_name: data.business_name || "",
          slug: data.slug || "",
          whatsapp_number: data.whatsapp_number || "",
          categories: data.categories || [],
          delivery_areas: data.delivery_areas || [],
          logo: data.logo || "",
          is_active: data.is_active !== false,
          order_reset_type: ["shift", "daily"].includes(data.order_reset_type) ? data.order_reset_type : "shift",
          primary_color: data.primary_color || "#ea580c",
          show_table_number: data.show_table_number === true,
          show_queue_number: data.show_queue_number === true,
          whatsapp_ordering_enabled: data.whatsapp_ordering_enabled !== false,
          show_phone_number: data.show_phone_number !== false,
          automated_hours_enabled: data.automated_hours_enabled === true,
          opening_time: data.opening_time || "09:00",
          closing_time: data.closing_time || "23:00",
        };
      }
    }
  },
  { immediate: true }
);

// QR Code Logic
const menuUrl = computed(() => {
  if (!form.value.slug) return "https://getmenujet.com/menu";
  const cleanSlug = form.value.slug
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
  return `https://getmenujet.com/menu/${cleanSlug}`;
});

const qrUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    menuUrl.value,
  )}`;
});

const copyMenuUrl = () => {
  navigator.clipboard.writeText(menuUrl.value);
  $toast.success(t("admin.copy_success"));
};

const downloadQr = async () => {
  try {
    const response = await fetch(qrUrl.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${form.value.slug || "menu"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    window.open(qrUrl.value, "_blank");
  }
};

// Form Actions
const addCategory = () => {
  const cat = newCategory.value.trim();
  if (!cat) return $toast.error($t("admin.error_fields"));
  if (form.value.categories.includes(cat))
    return $toast.error($t("admin.category_exists"));

  if (isCategoryLimitReached.value) {
    $toast.error(
      t("plans.cats_limit_toast", { max: maxCategories.value })
    );
    openUpgradeForCategories();
    return;
  }

  form.value.categories.push(cat);
  newCategory.value = "";
};

const addDeliveryArea = () => {
  if (!can('allow_branches')) {
    openUpgradeForFeature(t('plans.feat_delivery'), t('plans.pro_badge_short'), t('plans.delivery_modal_msg'));
    return;
  }

  const name = newDeliveryArea.value.name.trim();
  const price = newDeliveryArea.value.price;
  
  if (!name || price === '' || price < 0) {
    return $toast.error(t("admin.add_area_error"));
  }
  
  if (!form.value.delivery_areas) form.value.delivery_areas = [];
  
  if (form.value.delivery_areas.some(a => a.name === name)) {
    return $toast.error(t("admin.area_exists_error"));
  }
  
  form.value.delivery_areas.push({ name, price: Number(price) });
  newDeliveryArea.value = { name: '', price: '' };
};

const removeDeliveryArea = (index) => {
  form.value.delivery_areas.splice(index, 1);
};

// Category Reordering & Editing Logic
const editingCategoryIndex = ref(-1);
const editingCategoryName = ref("");
const editInput = ref(null);

const startEditCategory = (index) => {
  editingCategoryIndex.value = index;
  editingCategoryName.value = form.value.categories[index];
  nextTick(() => {
    // Handling possible array from v-for ref
    const input = Array.isArray(editInput.value)
      ? editInput.value[0]
      : editInput.value;
    input?.focus?.();
  });
};

const cancelEditCategory = () => {
  editingCategoryIndex.value = -1;
  editingCategoryName.value = "";
};

const saveCategoryName = async (index) => {
  const oldName = form.value.categories[index];
  const newName = editingCategoryName.value.trim();

  if (!newName || newName === oldName) {
    cancelEditCategory();
    return;
  }

  // Prevent duplicate names
  if (form.value.categories.some((c, i) => c === newName && i !== index)) {
    $toast.error($t("admin.category_exists"));
    cancelEditCategory();
    return;
  }

  // Update local state IMMEDIATELY for snappy UI
  form.value.categories[index] = newName;
  cancelEditCategory();

  // If we have a user, update the menu items too (background)
  if (ownerId.value) {
    await updateItemsCategory(oldName, newName, ownerId.value);
  }
};

const moveCategory = (index, direction) => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= form.value.categories.length) return;

  const cats = [...form.value.categories];
  const temp = cats[index];
  cats[index] = cats[newIndex];
  cats[newIndex] = temp;
  form.value.categories = cats;
};

const showDeleteCategoryModal = ref(false);
const categoryToDeleteIndex = ref(null);

const removeCategory = async (index) => {
  if (form.value.categories.length <= 1) {
    return $toast.error($t("admin.at_least_one_category"));
  }
  const catName = form.value.categories[index];
  form.value.categories.splice(index, 1);
  if (ownerId.value && catName) {
    await deleteItemsByCategory(catName, ownerId.value);
  }
};

const initiateRemoveCategory = (index) => {
  if (form.value.categories.length <= 1) {
    return $toast.error($t("admin.at_least_one_category"));
  }
  categoryToDeleteIndex.value = index;
  showDeleteCategoryModal.value = true;
};

const confirmRemoveCategory = async () => {
  if (categoryToDeleteIndex.value === null) return;
  await removeCategory(categoryToDeleteIndex.value);
  categoryToDeleteIndex.value = null;
  showDeleteCategoryModal.value = false;
};

const uploadLogo = async (event) => {
  const file = event.target.files[0];
  if (!file || !ownerId.value) return;

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    $toast.error("حجم الصورة كبير جداً، الحد الأقصى هو 5 ميجا");
    event.target.value = '';
    return;
  }

  const url = await uploadLogoAction(file, ownerId.value);
  if (url) form.value.logo = url;
};

const saveSettings = async () => {
  if (!ownerId.value) return;

  // Be very specific about fields to update to avoid conflicts with triggers/RLS on other tables
  const settingsData = {
    business_name: form.value.business_name,
    // Sync with localized field to avoid ghosting old names
    business_name_ar: form.value.business_name,
    slug: form.value.slug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-"),
    whatsapp_number: form.value.whatsapp_number,
    categories: [...form.value.categories],
    delivery_areas: form.value.delivery_areas ? [...form.value.delivery_areas] : [],
    logo: form.value.logo,
    is_active: form.value.is_active !== false,
    order_reset_type: form.value.order_reset_type || "shift",
    primary_color: form.value.primary_color || "#ea580c",
    show_table_number: form.value.show_table_number === true,
    show_queue_number: form.value.show_queue_number === true,
    whatsapp_ordering_enabled: form.value.whatsapp_ordering_enabled !== false,
    show_phone_number: form.value.show_phone_number !== false,
    automated_hours_enabled: form.value.automated_hours_enabled === true,
    opening_time: form.value.opening_time,
    closing_time: form.value.closing_time,
  };

  const success = await updateProfile(ownerId.value, settingsData);
  
  if (success) {
    // Update global auth store immediately for sidebar reactivity
    const authStore = useAuthStore();
    authStore.profile = { ...authStore.profile, ...settingsData };
  }
};
</script>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
