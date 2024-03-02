import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Tarefa } from '../interface/tarefa';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly API = 'http://localhost:3000/tarefas';

  //o Subject, é um tipo especial, uma variante do subject, que pode atuar como Observeble - Emitindo,
  // e também como um Observer - Captando
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]) //Iniciando como um array vazio
  tarefasAtualizadas$ = this.tarefasSubject.asObservable() //Criando novo Observable, cujo a fonte de dados será o subject acima

  constructor(private http: HttpClient) { }

  listar(): void {
    let params = new HttpParams().appendAll({
      _sort: 'id',
      _order: 'desc',
    })
    this.http.get<Tarefa[]>(this.API, { params })
      .subscribe((tasks) => {
        let tarefasTemporarias = this.tarefasSubject.getValue()
        console.log('Pegando tasks', tarefasTemporarias);
        tarefasTemporarias = tarefasTemporarias.concat(tasks)
        console.log('Concatenando tasks', tarefasTemporarias);
        this.tarefasSubject.next(tarefasTemporarias)
      });
  }

  criar(tarefa: Tarefa): void {
    this.http.post<Tarefa>(this.API, tarefa).subscribe(novaTarefa => {
      const tarefasTotais = this.tarefasSubject.getValue()
      tarefasTotais.unshift(novaTarefa) //inserindo no começo do array
      this.tarefasSubject.next(tarefasTotais)
    });
  }

  editar(tarefaRecbida: Tarefa): void {
    const url = `${this.API}/${tarefaRecbida.id}`;
    this.http.put<Tarefa>(url, tarefaRecbida).subscribe(tarefaEditada => {
      const tarefasTotais = this.tarefasSubject.getValue()
      const index = tarefasTotais.findIndex(task => task.id === tarefaEditada.id)
      if (index != -1) { //Caso não econtre, a função acima recebe -1
        tarefasTotais[index] = tarefaEditada
        this.tarefasSubject.next(tarefasTotais)
      }
    });
  }

  excluir(id: number): void {
    const url = `${this.API}/${id}`;
    this.http.delete<Tarefa>(url).subscribe(() => {
      const tarefasTotais = this.tarefasSubject.getValue()
      const index = tarefasTotais.findIndex(task => task.id === id)
      if (index != -1) { //Caso não econtre, a função acima recebe -1
        tarefasTotais.splice(index, 1)
        this.tarefasSubject.next(tarefasTotais)
      }
    });
  }

  atualizarStatusTarefa(tarefa: Tarefa): void {
    tarefa.statusFinalizado = !tarefa.statusFinalizado;
     this.editar(tarefa);
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.get<Tarefa>(url);
  }


  //_______________________________Antes da refatorando, do Subject_______________________________
  // listar(categoria: string): Observable<Tarefa[]> {
  //   let params = new HttpParams().appendAll({
  //     _sort: 'id',
  //     _order: 'desc',
  //   });
  //   if (categoria) {
  //     params = params.append('categoria', categoria);
  //   }
  //   return this.http.get<Tarefa[]>(this.API, { params });
  // }


  // criar(tarefa: Tarefa): Observable<Tarefa> {
  //   return this.http.post<Tarefa>(this.API, tarefa);
  // }


  // editar(tarefa: Tarefa): Observable<Tarefa> {
  //   const url = `${this.API}/${tarefa.id}`;
  //   return this.http.put<Tarefa>(url, tarefa);
  // }

  // excluir(id: number): Observable<Tarefa> {
  //   const url = `${this.API}/${id}`;
  //   return this.http.delete<Tarefa>(url);
  // }


  // atualizarStatusTarefa(tarefa: Tarefa): Observable<Tarefa> {
  //   tarefa.statusFinalizado = !tarefa.statusFinalizado;
  //   return this.editar(tarefa);
  // }
}
