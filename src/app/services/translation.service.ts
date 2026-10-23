import { Injectable, signal, computed, effect } from '@angular/core';
import { Language, TRANSLATIONS } from '../i18n/translations';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'salak_lang';

  // Signal pour la langue courante (par défaut 'fr')
  readonly currentLang = signal<Language>(this.getInitialLanguage());

  // Direction du document (RTL pour l'arabe, LTR pour le français)
  readonly dir = computed<'ltr' | 'rtl'>(() => (this.currentLang() === 'ar' ? 'rtl' : 'ltr'));

  // Helpers pratiques
  readonly isArabic = computed<boolean>(() => this.currentLang() === 'ar');
  readonly isFrench = computed<boolean>(() => this.currentLang() === 'fr');

  constructor() {
    // Effet réactif : met à jour automatiquement la balise <html> du DOM
    effect(() => {
      const lang = this.currentLang();
      const dir = this.dir();

      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dir);
        if (dir === 'rtl') {
          document.documentElement.classList.add('rtl-mode');
        } else {
          document.documentElement.classList.remove('rtl-mode');
        }
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, lang);
      }
    });
  }

  private getInitialLanguage(): Language {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (saved === 'fr' || saved === 'ar') {
        return saved;
      }
    }
    return 'fr';
  }

  setLanguage(lang: Language): void {
    if (lang === 'fr' || lang === 'ar') {
      this.currentLang.set(lang);
    }
  }

  toggleLanguage(): void {
    this.setLanguage(this.currentLang() === 'fr' ? 'ar' : 'fr');
  }

  /**
   * Traduit une clé avec remplacement éventuel de paramètres (ex: {count}, {name})
   */
  t(key: string, params?: Record<string, string | number>): string {
    const entry = TRANSLATIONS[key];
    const current = this.currentLang();
    let text = entry ? (entry[current] || entry.fr || key) : key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  }
}
