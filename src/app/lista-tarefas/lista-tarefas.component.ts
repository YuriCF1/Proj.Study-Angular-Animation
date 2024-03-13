import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TarefaService } from 'src/app/service/tarefa.service';
import { Tarefa } from '../interface/tarefa';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { checkedStateTrigger, filterTrigger, flyInOutTrigger, formButtonTrigger, highlitedStateTrigger, listSatateTrigger, shakeTrigger, showStateTrigger } from '../animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.css', './lista-tarefas.component2.css'],
  animations: [highlitedStateTrigger, showStateTrigger, checkedStateTrigger,
    filterTrigger, formButtonTrigger, flyInOutTrigger, shakeTrigger, listSatateTrigger]
})

export class ListaTarefasComponent implements OnInit {
  listaTarefas: Tarefa[] = [];
  formAberto: boolean = false;
  categoria: string = '';
  validado: boolean = false;
  indexTarefa: number = -1 //Nao quero que nenhum card comece destacado
  idStyle: number = 0

  campoBusca: string = ''
  tarefasFiltradas: Tarefa[] = []

  tarefasSubscription: Subscription = new Subscription;

  formulario: FormGroup = this.fomBuilder.group({
    id: [0],
    descricao: ['', Validators.required],
    statusFinalizado: [false, Validators.required],
    categoria: ['Casa', Validators.required],
    prioridade: ['Alta', Validators.required],
  });

  constructor(
    private service: TarefaService,
    // private router: Router,
    private fomBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.service.listar()
    this.tarefasSubscription = this.service.tarefasAtualizadas$.subscribe(tasks => {
      this.listaTarefas = tasks;
      this.tarefasFiltradas = tasks;
    })
  };
  // return this.tarefasFiltradas;

  filtrarTarefasPorDescricao(descricao: string) {
    this.campoBusca = descricao.trim().toLowerCase()
    if (descricao) {
      this.tarefasFiltradas = this.listaTarefas.filter(tasks => tasks.descricao.
        toLowerCase().includes(this.campoBusca))
    } else {
      this.tarefasFiltradas = this.listaTarefas
    }
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
    this.resetarFormulario();
  }

  cancelar() {
    this.formAberto = false;
    this.resetarFormulario();
  }

  salvarTarefa() {
    if (this.formulario.value.id) {
      this.editarTarefa();
    } else {
      this.criarTarefa();
    }
  }

  editarTarefa() {
    if (this.formulario.valid) {
      const tarefaEditada = this.formulario.value
      this.service.editar(tarefaEditada, true)
      this.resetarFormulario()
    }
    // this.service.editar(this.formulario.value).subscribe({
    //   complete: () => this.atualizarComponente(),
    // });
  }

  criarTarefa() {
    if (this.formulario.valid) {
      const novaTarefa = this.formulario.value
      this.service.criar(novaTarefa)
      this.resetarFormulario()
    }
    // this.service.criar(this.formulario.value).subscribe({
    //   complete: () => this.atualizarComponente(),
    // });
  }

  excluirTarefa(tarefa: Tarefa) {
    if (tarefa.id) {
      this.service.excluir(tarefa.id)
      // this.service.excluir(id).subscribe({
      //   complete: () => this.recarregarComponente(),
      // });
    }
  }

  resetarFormulario() {
    this.formulario.reset({
      descricao: '',
      statusFinalizado: false,
      categoria: '',
      prioridade: '',
    });
  }

  //MÉTODOS INÚTEIS APÓS A UTILIZAÇÃO DO BehaviorSubject. Já que as rotas não estão mais sendo
  // recarregarComponente() {
  //   this.router.navigate(['/listaTarefas']);
  // }

  // atualizarComponente() {
  //   this.recarregarComponente();
  //   this.resetarFormulario();
  // }
  // listarAposCheck() {
  //   this.service.listar(this.categoria).subscribe((listaTarefas) => {
  //     this.listaTarefas = listaTarefas;
  //     this.tarefasFiltradas = listaTarefas
  //   });
  // }

  carregarParaEditar(id: number) {
    this.service.buscarPorId(id!).subscribe((tarefa) => {
      this.formulario = this.fomBuilder.group({
        id: [tarefa.id],
        descricao: [tarefa.descricao],
        categoria: [tarefa.categoria],
        statusFinalizado: [tarefa.statusFinalizado],
        prioridade: [tarefa.prioridade],
      });
    });
    this.formAberto = true;
  }

  finalizarTarefa(tarefa: Tarefa) {
    // finalizarTarefa(id: number) {
    this.service.atualizarStatusTarefa(tarefa)
    // if (tarefa.statusFinalizado) {
    // } else {
    //   this.idStyle = NaN;
    // }
    // this.idStyle = id
    // this.service.buscarPorId(id!).subscribe((tarefa) => {
    //     this.listarAposCheck();
    //   });
    // });
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  campoValidado(campoAtual: string): string {
    if (
      this.formulario.get(campoAtual)?.errors &&
      this.formulario.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-tarefa input-invalido';
    } else {
      this.validado = true;
      return 'form-tarefa';
    }
  }
}
