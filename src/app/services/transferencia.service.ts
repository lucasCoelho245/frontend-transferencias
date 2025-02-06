import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {
  private apiUrl = 'http://127.0.0.1:8081/transferencias';

  private http = inject(HttpClient);

  public getTransferencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  public criarTransferencia(transferencia: any): Observable<any> {
    return this.http.post(this.apiUrl, transferencia);
  }
}
