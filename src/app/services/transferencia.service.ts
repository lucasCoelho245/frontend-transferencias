import {Observable} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransferenciaService {
  private apiUrl: string;

  private http = inject(HttpClient);

  constructor() {
    if (typeof window !== 'undefined') {
      const isVercel = window.location.hostname.includes('vercel.app');
      this.apiUrl = isVercel
        ? 'https://indirect-patty-lucascoelho-4d01551b.koyeb.app/transferencias'
        : 'http://localhost:8081/transferencias';
      console.log('Ambiente de Produção: Vercel');

    } else {
      this.apiUrl = 'http://localhost:8081/transferencias';
    }
  }

  public getTransferencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  public criarTransferencia(transferencia: any): Observable<any> {
    return this.http.post(this.apiUrl, transferencia);
  }

  public deleteTransferencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
