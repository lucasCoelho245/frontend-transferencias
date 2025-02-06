import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TransferenciaService } from '../../services/transferencia.service';
import { Transferencia } from './transferencia.model';
import { format, differenceInDays } from 'date-fns';

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

  constructor() {}

  ngOnInit(): void {
    this.transferenciaForm = this.fb.group({
      contaOrigem: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      contaDestino: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      valor: [null, [Validators.required, Validators.min(1)]],
      dataTransferencia: ['', [Validators.required, this.validarDataTransferencia]],
    });

    this.carregarTransferencias();
  }

  public carregarTransferencias(): void {
    this.service.getTransferencias().subscribe({
      next: (res) => (this.transferencias = res),
      error: (err) => console.error('Erro ao buscar transferências:', err),
    });
  }

  public agendarTransferencia(): void {
    if (this.transferenciaForm.invalid) {
      return;
    }

    const dataSelecionada = this.transferenciaForm.get('dataTransferencia')?.value;

    // Convertendo a data sem alterações de fuso horário
    const dataTransferenciaFormatada = format(new Date(dataSelecionada + 'T00:00:00'), 'yyyy-MM-dd');

    const novaTransferencia: Transferencia = {
      id: Math.floor(Math.random() * 1000),
      contaOrigem: this.transferenciaForm.get('contaOrigem')?.value,
      contaDestino: this.transferenciaForm.get('contaDestino')?.value,
      valor: this.transferenciaForm.get('valor')?.value,
      taxa: 12.0,
      dataTransferencia: dataTransferenciaFormatada,
      dataAgendamento: format(new Date(), 'yyyy-MM-dd'),
    };

    this.service.criarTransferencia(novaTransferencia).subscribe({
      next: () => {
        this.carregarTransferencias();
        this.transferenciaForm.reset();
      },
      error: (err) => console.error('Erro ao criar transferência:', err),
    });
  }

  public preencherFormulario(): void {
    this.transferenciaForm.setValue({
      contaOrigem: '1234567890',
      contaDestino: '0987654321',
      valor: 1000.0,
      dataTransferencia: '2025-02-10',
    });
  }

  public getControl(campo: string): AbstractControl | null {
    return this.transferenciaForm.get(campo);
  }

  public filtrarNumeros(event: any): void {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
  }

  private validarDataTransferencia(control: AbstractControl): { [key: string]: any } | null {
    const dataTransferencia = new Date(control.value);
    const hoje = new Date();
    const maxData = new Date();
    maxData.setDate(hoje.getDate() + 50);

    return dataTransferencia > maxData ? { dataInvalida: true } : null;
  }
}
