<template>
  <section id="contact" class="py-20 bg-orange-600">
    <div class="container mx-auto px-6 text-center text-white">
      <h2 class="text-3xl font-black mb-4">جاهز تطور مطعمك؟</h2>
      <p class="mb-10 opacity-90 text-lg">سيب بياناتك وهنكلمك نفعلك حسابك المجاني فوراً</p>
      <form @submit.prevent="sendWhatsApp" class="max-w-lg mx-auto space-y-4">
        <input v-model="form.name" type="text" placeholder="الاسم" class="w-full p-4 rounded-xl text-gray-900 outline-none" required>
        <input v-model="form.restaurant" type="text" placeholder="اسم المطعم" class="w-full p-4 rounded-xl text-gray-900 outline-none" required>
        <button class="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition">
          اطلب الديمو على الواتساب
        </button>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return { form: { name: '', restaurant: '' } }
  },
  methods: {
    sendWhatsApp() {
      const msg = `أهلاً MenuJet، أنا ${this.form.name} صاحب مطعم ${this.form.restaurant} ومحتاج أجرب المنيو المجاني.`;
      window.open(`https://wa.me/201094123678?text=${encodeURIComponent(msg)}`, '_blank');
    }
  }
}
</script>