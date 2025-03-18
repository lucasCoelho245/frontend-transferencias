import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TransferenciaService } from '../../services/transferencia.service';
import { Transferencia } from './transferencia.model';
import { format } from 'date-fns';
import { ValidacaoDataService } from '../../services/validacao-data';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-transferencias',
  standalone: true,
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class TransferenciasComponent implements OnInit {
  public transferenciaForm!: FormGroup;
  public transferencias: Transferencia[] = [];

  private service = inject(TransferenciaService);
  private fb = inject(FormBuilder);
  private validacaoDataService = inject(ValidacaoDataService);

  constructor() {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarTransferencias();
  }

  private inicializarFormulario(): void {
    this.transferenciaForm = this.fb.group({
      contaOrigem: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      contaDestino: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      valor: ['', [Validators.required, Validators.min(1), Validators.max(9999999), Validators.pattern(/^[0-9]+$/)]],
      dataTransferencia: ['', [Validators.required, this.validacaoDataService.validarData.bind(this.validacaoDataService)]],
    });
  }

  private validarFormulario(): boolean {
    return this.transferenciaForm.valid;
  }

  public carregarTransferencias(): void {
    this.service.getTransferencias().subscribe({
      next: (res) => (this.transferencias = res),
      error: (err) => console.error('Erro ao buscar transferências:', err),
    });
  }

  public agendarTransferencia(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const novaTransferencia = this.criarTransferencia();
    this.service.criarTransferencia(novaTransferencia).subscribe({
      next: () => {
        this.carregarTransferencias();
        this.resetarFormulario();
      },
      error: (err) => console.error('Erro ao criar transferência:', err),
    });
  }

  private criarTransferencia(): Transferencia {
    const dataTransferencia = this.formatarDataTransferencia();
    return {
      id: this.gerarIdTransferencia(),
      contaOrigem: this.transferenciaForm.get('contaOrigem')?.value,
      contaDestino: this.transferenciaForm.get('contaDestino')?.value,
      valor: this.transferenciaForm.get('valor')?.value,
      taxa: 12.00,
      dataTransferencia: format(dataTransferencia, 'yyyy-MM-dd'),
      dataAgendamento: format(new Date(), 'yyyy-MM-dd'),
    };
  }

  private formatarDataTransferencia(): Date {
    const dataTransferencia = new Date(this.transferenciaForm.get('dataTransferencia')?.value);
    dataTransferencia.setMinutes(dataTransferencia.getMinutes() + dataTransferencia.getTimezoneOffset());
    return dataTransferencia;
  }

  private gerarIdTransferencia(): number {
    return Math.floor(Math.random() * 1000);
  }

  public preencherFormulario(): void {
    this.transferenciaForm.setValue({
      contaOrigem: '1234567890',
      contaDestino: '0987654321',
      valor: 1000.0,
      dataTransferencia: new Date().toISOString().split('T')[0],
    });
  }

  public getControl(campo: string): AbstractControl | null {
    return this.transferenciaForm.get(campo);
  }

  private resetarFormulario(): void {
    this.transferenciaForm.reset();
    this.transferenciaForm.markAsPristine();
    this.transferenciaForm.markAsUntouched();
  }

  public filtrarNumeros(event: any): void {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
  }

  public deletarTransferencia(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID da transferência não pode ser undefined');
      return;
    }
    this.service.deleteTransferencia(id).subscribe({
      next: () => {
        this.carregarTransferencias();
      },
      error: (err) => console.error('Erro ao deletar transferência:', err),
    });
  }


}
