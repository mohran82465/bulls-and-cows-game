import { Component, Directive, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from './services/theme.service';

const DIGITS = 4; 

interface Guess { 
  cows:number; 
  bulls: number; 
  n:number; 
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  guess = signal('')
  answer = signal<number[]>([]);
  errorText = signal('');
  guessHistory = signal<Guess[]>([]);
  gameStatus = signal('init')
  message = signal(''); 
  
  readonly themeService = inject(ThemeService); 
  isLight = model(this.themeService.getCurrentTheme()()==='light'); 
  
  
  constructor() {
    this.reset();

  }


  reset(){
    this.gameStatus.set('init'); 
    this.guessHistory.set([]); 
    this.message.set(''); 
    this.guess.set('');
    
    while (true) {
      const digits = [];
      for (let i = 0; i < DIGITS; i++) {
        digits.push(Math.floor(Math.random() * 9));
      }
      if (digits[0] === 0) {
        continue;
      }
      const digitsSet = new Set(digits);
      if (digitsSet.size === DIGITS) {
        this.answer.set(digits);
        break;
      }
    }
    console.log(this.answer());

  }


  inputChange(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.guess.set(text);
  }

  guessNumber() {
    this.errorText.set(''); 
    if (this.guess().length !== DIGITS) {

      this.errorText.set(`You must enter ${DIGITS} digits `)
      return;
    }
    const digits = this.guess().split('').map(n => +n);
    const digitsSet = new Set(digits);
    if (digitsSet.size !== DIGITS) {

      this.errorText.set('You must enter un ique digits')
      return;
    }

    const [bulls, cows] = this.bullsCows(digits, this.answer());
    this.guessHistory.update(h => {
    h.push({n: +digits.map(d=>d.toString()).join('') , bulls, cows});
      return h;
    })

    if(bulls===DIGITS){
      this.message.set(`Yeeey! you won the game! Number of tries: ${this.guessHistory().length}`)
      this.gameStatus.set('won'); 
    } 
  }

  bullsCows(guess: number[], answer: number[]) {
    let bulls = 0;
    let cows = 0;
    const n = guess.length;
    const bullUsed = new Set<number>();
    for (let i = 0; i < n; i++) {

      if (guess[i] == answer[i]) {
        bulls++;
        bullUsed.add(i);
      }
    }

    for (let i = 0; i < n; i++) {
      if (!bullUsed.has(i) && answer.includes(guess[i])) { cows++; }
    }


    return [bulls, cows];
  }

}
