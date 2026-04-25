import { ref } from 'vue'

const deferredPrompt = ref<any>(null)
const isInstallable = ref(false)

export function usePwaInstall() {
  if (import.meta.client) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
      isInstallable.value = false
    })
  }

  async function triggerInstall() {
    if (!deferredPrompt.value) return
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      deferredPrompt.value = null
      isInstallable.value = false
    }
  }

  return { isInstallable, triggerInstall }
}
