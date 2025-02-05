import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ApiService} from '../../services/api.service';  // <- ADICIONE ISSO

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [CommonModule, FormsModule], // <- ADICIONE FormsModule
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.scss']
})
export class TransferenciasComponent implements OnInit {
  transferencias: any[] = [];
  novaTransferencia = {
    contaOrigem: '',
    contaDestino: '',
    valor: 0,
    dataTransferencia: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarTransferencias();
  }

  carregarTransferencias() {
    this.apiService.getTransferencias().then(response => {
      this.transferencias = response.data;
    }).catch(error => {
      console.error("Erro ao buscar transferências:", error);
    });
  }

  agendarTransferencia() {
    this.apiService.criarTransferencia(this.novaTransferencia).then(response => {
      this.transferencias.push(response.data);
      this.novaTransferencia = { contaOrigem: '', contaDestino: '', valor: 0, dataTransferencia: '' };
    }).catch(error => {
      alert("Erro ao agendar transferência.");
    });
  }
}
