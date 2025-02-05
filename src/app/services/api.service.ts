import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8081', // URL corrigida
    headers: { 'Content-Type': 'application/json' }
  });

  // Buscar todas as transferências
  getTransferencias(): Promise<AxiosResponse<any>> {
    return this.api.get('/transferencias');
  }

  // Criar uma nova transferência
  criarTransferencia(transferencia: any): Promise<AxiosResponse<any>> {
    return this.api.post('/transferencias', transferencia);
  }
}
