import { animate, state, style, transition, trigger } from '@angular/animations';

export const highlitedStateTrigger = trigger('highlitedState', [ //Rece 2 parametros. 1 - Nome do trigger, que remete a animação. 2 - Array de metadados. Contendo states e styles
  state('default', style({
    border: '2px solid #B2B6FF',
    // Maneiras de declaração
    // 'background-color': 'valor'
    // backgroundColor: 'valor'
  }
  )),
  state('highlighted', style({
    border: '4px solid #B2B6FF',
    filter: 'brightness(92%)'
  })),
  transition('default => highlighted', [
    animate('600ms 100ms cubic-bezier(0.25, 1, 0.5, 1)', style({ //Duração da animação | Delay | easing
      transform: 'scale(1.02)'
    }),) //
    // animate('200s') //Se quiser a unicdade de tempo
    // animate(200) //Duranção da transição
  ])
])
