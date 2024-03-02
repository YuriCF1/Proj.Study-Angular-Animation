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
  private tarefasSubjects = new BehaviorSubject<Tarefa[]>([]) //Iniciando como um array vazio
  tarefasAtualizadas$ = this.tarefasSubjects.asObservable() //Criando novo Observable, cujo a fonte de dados será o subject acima

  constructor(private http: HttpClient) {}

  //Antes da refatorando, do Subject
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

  listar(): void {
    let params = new HttpParams().appendAll({
      _sort: 'id',
      _order: 'desc',
    })
    this.http.get<Tarefa[]>(this.API, { params })
    .subscribe((tasks) => {
      let tarefasTemporarias = this.tarefasSubjects.getValue()
      console.log('Pegando tasks', tarefasTemporarias);
      tarefasTemporarias = tarefasTemporarias.concat(tasks)
      console.log('Concatenando tasks', tarefasTemporarias);
      this.tarefasSubjects.next(tarefasTemporarias)
    });
  }



  criar(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.API, tarefa);
  }

  editar(tarefa: Tarefa): Observable<Tarefa> {
    const url = `${this.API}/${tarefa.id}`;
    return this.http.put<Tarefa>(url, tarefa);
  }

  excluir(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.delete<Tarefa>(url);
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.get<Tarefa>(url);
  }

  atualizarStatusTarefa(tarefa: Tarefa): Observable<Tarefa> {
    tarefa.statusFinalizado = !tarefa.statusFinalizado;
    return this.editar(tarefa);
  }
}
