// app/composables/useOrderNotifications.ts

export const useOrderNotifications = () => {
  const client = useSupabaseClient<any>();
  const { $toast } = useNuxtApp();
  const { locale } = useI18n();

  const isAudioEnabled = useState<boolean>("admin_audio_enabled", () => true);
  const isAudioUnlocked = useState<boolean>("admin_audio_unlocked", () => false);
  const realtimeChannel = useState<any>("admin_notifications_channel", () => null);

  let audioInstance: HTMLAudioElement | null = null;

  // Initialize or get the audio instance
  const getAudio = () => {
    if (process.client && !audioInstance) {
      audioInstance = new Audio("/notification.mp3");
      audioInstance.preload = "auto";
    }
    return audioInstance;
  };

  // Fallback sound synthesizer via Web Audio API (in case mp3 fails or is blocked on some devices)
  const playFallbackBeep = () => {
    if (!process.client) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Fallback beep failed:", e);
    }
  };

  // Mobile Audio Unlock: Triggered on user interaction to satisfy iOS/Android autoplay policy
  const unlockAudio = () => {
    if (!process.client || isAudioUnlocked.value) return;

    try {
      const audio = getAudio();
      if (audio) {
        audio.volume = 0.01;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.volume = 1.0;
              isAudioUnlocked.value = true;
              console.log("🔊 Audio successfully unlocked for mobile/browser");
            })
            .catch((err) => {
              console.warn("Could not unlock audio yet:", err);
            });
        }
      }
    } catch (e) {
      console.warn("Audio unlock error:", e);
    }

    requestNotificationPermission();
  };

  // Request browser notification permission (works on Android Chrome, Windows, Mac, and iOS PWA)
  const requestNotificationPermission = async () => {
    if (process.client && "Notification" in window) {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (e) {
          console.warn("Notification permission error:", e);
        }
      }
    }
  };

  // Play notification sound + vibrate phone + trigger OS notification
  const notifyNewOrder = (order: any) => {
    if (!process.client) return;

    // 1. Play Sound
    if (isAudioEnabled.value) {
      try {
        const audio = getAudio();
        if (audio) {
          audio.currentTime = 0;
          audio.volume = 1.0;
          const p = audio.play();
          if (p !== undefined) {
            p.catch((err) => {
              console.warn("Audio play blocked, attempting fallback beep:", err);
              playFallbackBeep();
            });
          }
        } else {
          playFallbackBeep();
        }
      } catch (err) {
        playFallbackBeep();
      }
    }

    // 2. Mobile Vibration
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate([300, 150, 300, 150, 400]);
      } catch (e) {}
    }

    // 3. In-App Toast Alert (Clickable to navigate to orders)
    const orderNum = (order.order_number || order.id || "").toString().padStart(4, "0");
    const total = order.total_price || 0;
    const isAr = locale.value === "ar";

    if ($toast?.success) {
      $toast.success(
        isAr
          ? `🔔 طلب جديد #${orderNum} بقيمة ${total} جنيه`
          : `🔔 New Order #${orderNum} - ${total} EGP`,
        {
          action: {
            label: isAr ? "عرض الطلب" : "View Order",
            onClick: () => navigateTo("/admin/orders"),
          },
          duration: 8000,
        }
      );
    }

    // 4. Native OS / Mobile Push Notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(isAr ? `طلب جديد #${orderNum}` : `New Order #${orderNum}`, {
          body: isAr
            ? `طلب جديد بقيمة ${total} جنيه تم استلامه الآن`
            : `New order of ${total} EGP received just now`,
          icon: "/pwa-192x192.png",
          badge: "/pwa-192x192.png",
          tag: `order-${order.id}`,
        });
      } catch (e) {
        console.warn("Native notification display failed:", e);
      }
    }
  };

  // Test sound function (also acts as manual unlock for user on mobile)
  const testSound = () => {
    unlockAudio();
    notifyNewOrder({ order_number: 99, total_price: 150 });
  };

  // Start Global Realtime Listener for the Admin across the whole layout
  const startGlobalOrderListener = (ownerId: string) => {
    if (!process.client || !ownerId || realtimeChannel.value) return;

    console.log("📡 Starting global order listener for restaurant:", ownerId);

    // Auto-unlock audio on first touch/click anywhere on mobile or desktop
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    realtimeChannel.value = client
      .channel(`admin-global-orders-${ownerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${ownerId}`,
        },
        (payload: any) => {
          console.log("🔔 New order received globally:", payload.new);
          notifyNewOrder(payload.new);
        }
      )
      .subscribe();
  };

  const stopGlobalOrderListener = () => {
    if (realtimeChannel.value) {
      client.removeChannel(realtimeChannel.value);
      realtimeChannel.value = null;
    }
  };

  return {
    isAudioEnabled,
    isAudioUnlocked,
    unlockAudio,
    testSound,
    requestNotificationPermission,
    notifyNewOrder,
    startGlobalOrderListener,
    stopGlobalOrderListener,
  };
};
