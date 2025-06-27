import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Heroi {
  id?: number;
  nome: string;
  nomeDoHeroi: string;
  dataDeNascimento: string;
  altura: number;
  peso: number;
}

@Injectable({
  providedIn: 'root'
})
export class HeroiService {
  private apiUrl = 'http://localhost:8080/api/heroi/v1';

  constructor(private http: HttpClient) {}

  listarHerois(): Observable<Heroi[]> {
    return this.http.get<Heroi[]>(this.apiUrl);
  }

  cadastrarHeroi(heroi: Heroi): Observable<Heroi> {
    return this.http.post<Heroi>(this.apiUrl, heroi);
  }

  atualizarHeroi(heroi: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, heroi); // ✅ sem ID na URL
  }

  deletarHeroi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
