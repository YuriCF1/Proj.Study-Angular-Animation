import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

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


export const showStateTrigger = trigger('showState', [
  // state('notShown', style({

  // })),
  // state('shown', style({

  // })),
  // transition('notShown => shown', [
  // transition('void => shown', [

  //  Se eu não quiser nomear o estado, para qualquer estado válido possível, uso o asterisco
  // transition('void => *', [

  //Também posso nomear, de void para qualquer estado(*). :enter. E saindo do DOM, :leave
  transition(':enter', [
    style({
      opacity: 0
    }), animate(200, style({
      opacity: 1
    }))
  ]),
  // transition('shown => void', [
  // transition('* => void', [

  transition(':leave', [
    animate(200, style({
      opacity: 0
    }))
  ])
])

export const checkedStateTrigger = trigger('checkedState', [
  // state('default', style({
  //   backgroundColor: 'red'
  // }
  // )),
  // state('checked', style({
  //   backgroundColor: 'blue'
  // })), transition('default => checked', [
  //   animate('1000ms ease-out')
  // ])
  transition('* => checked', [
    animate('400ms ease-in', style({
      transform: 'scale(0.4)'
    }))
  ])
])


/*
trigger() - inicia a animação e serve como um contêiner para todas as outras chamadas de função de animação.
O template é vinculado ao nome do trigger, que é declarado como primeiro argumento da função. Usa sintaxe de matriz.

style() - define um ou mais estilos CSS para usar em animações. Controla a aparência visual dos elementos HTML durante as animações. Usa sintaxe de objeto.

state() - cria um conjunto nomeado de estilos CSS que devem ser aplicados na transição bem-sucedida para um determinado estado. O estado pode então ser referenciado pelo nome dentro de outras funções de animação.

animate() - especifica as informações de tempo para uma transição. Valores opcionais para delay e easing function. Pode conter métodos style().

transition() - define a sequência de animação entre dois estados nomeados. Usa sintaxe de matriz.
*/

export const filterTrigger = trigger('filterAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      width: 0
    }), animate('2000ms ease-out', keyframes([
      style({ offset: 0, opacity: 0, width: 0 }),
      style({ offset: 0.5, opacity: 0.5, width: '*', backgroundColor: 'lightgreen' }),
      style({ offset: 1, opacity: 1, width: '*', backgroundColor: 'lightblue' })
    ]))
  ]),
  transition(':leave', [
    animate('800ms cubic-bezier(.13,.9,.8,.1)', style({
      opacity: 0,
      width: 0
    }))
  ])
])

export const formButtonTrigger = trigger('formButton', [
  transition('invalid => valid', [
    animate(100, style({
      backgroundColor: '#63B77C'
    })),
    animate(100, style({
      transform: 'scale(1.05)'
    })),
    animate(200, style({
      transform: 'scale(1.1)'
    }))
  ])
])
