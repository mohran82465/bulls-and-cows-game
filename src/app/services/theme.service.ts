import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light' 


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly document = inject(DOCUMENT); 
  private readonly currentTheme = signal<Theme>('light')
  constructor() { 
    this.setTheme(this.getThemeFromLocalStorage());
  }

  getCurrentTheme(){
    return this.currentTheme.asReadonly(); 
    
  }

  toggleTheme() {
    if(this.currentTheme() === 'light'){
          this.setTheme('dark'); 
    }
    else{
      this.setTheme('light');
    }
  }

  private setTheme(theme: Theme){
    this.currentTheme.set(theme);
    this.document.documentElement.setAttribute('data-theme',theme); 
    this.setThemeLocalStorage(theme); 
  }

  private setThemeLocalStorage(theme:Theme){
    localStorage.setItem('preferred-themed',theme); 
  }

  private getThemeFromLocalStorage(){
    return localStorage.getItem('preferred-themed') as Theme ?? 'light'
  }

  
}
