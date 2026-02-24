import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private deferredPrompt: any = null;

  readonly showInstallModal = signal(false);
  readonly showUpdateModal = signal(false);
  readonly isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  readonly activeTab = signal<'android' | 'ios'>('android');

  get isInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  init(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const reg = await navigator.serviceWorker.register('./sw.js');
          setInterval(() => reg.update(), 10000);

          if (reg.waiting) this.showUpdateModal.set(true);

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateModal.set(true);
              }
            });
          });

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        } catch (err) {
          console.error('Erreur SW :', err);
        }
      });
    }

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.checkAndShowInstallModal();
    });
  }

  checkAndShowInstallModal(): void {
    if (this.isInstalled) return;

    if (this.deferredPrompt) {
      this.activeTab.set('android');
      this.showInstallModal.set(true);
      return;
    }

    if (this.isIOS) {
      this.activeTab.set('ios');
      this.showInstallModal.set(true);
    }
  }

  async triggerInstall(): Promise<void> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      this.showInstallModal.set(false);
    }
  }

  async triggerUpdate(): Promise<void> {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  closeInstallModal(): void {
    this.showInstallModal.set(false);
  }

  closeUpdateModal(): void {
    this.showUpdateModal.set(false);
  }

  setActiveTab(tab: 'android' | 'ios'): void {
    this.activeTab.set(tab);
  }
}
