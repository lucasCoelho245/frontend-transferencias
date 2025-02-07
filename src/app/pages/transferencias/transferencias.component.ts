import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TransferenciaService } from '../../services/transferencia.service';
import { Transferencia } from './transferencia.model';
import { format } from 'date-fns';

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
      contaOrigem: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      contaDestino: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      valor: ['', [Validators.required, Validators.min(1), Validators.max(9999999), Validators.pattern(/^[0-9]+$/)]],
      dataTransferencia: ['', [Validators.required, this.validarData.bind(this)]],
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

    const dataTransferencia = new Date(this.transferenciaForm.get('dataTransferencia')?.value);
    dataTransferencia.setMinutes(dataTransferencia.getMinutes() + dataTransferencia.getTimezoneOffset());

    const novaTransferencia: Transferencia = {
      id: Math.floor(Math.random() * 1000),
      contaOrigem: this.transferenciaForm.get('contaOrigem')?.value,
      contaDestino: this.transferenciaForm.get('contaDestino')?.value,
      valor: this.transferenciaForm.get('valor')?.value,
      taxa: 12.00, // Implementação fixa da taxa
      dataTransferencia: format(dataTransferencia, 'yyyy-MM-dd'),
      dataAgendamento: format(new Date(), 'yyyy-MM-dd'),
    };

    this.service.criarTransferencia(novaTransferencia).subscribe({
      next: () => {
        this.carregarTransferencias();
        this.resetarFormulario();
      },
      error: (err) => console.error('Erro ao criar transferência:', err),
    });
  }

  private validarData(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;

    const dataSelecionada = new Date(control.value + 'T00:00:00'); // Forçando a data para UTC
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Removendo a parte de horas para evitar deslocamento
    const maxDias = new Date();
    maxDias.setDate(hoje.getDate() + 50);

    if (dataSelecionada < hoje) {
      return { dataPassada: 'Taxa não aplicável: A data de transferência não pode ser anterior à data atual.' };
    }
    if (dataSelecionada > maxDias) {
      return { dataMuitoDistante: 'Taxa não aplicável: A data de transferência deve ser no máximo 50 dias após a data de agendamento.' };
    }
    if (dataSelecionada.getFullYear() < 2020 || dataSelecionada.getFullYear() > 2100) {
      return { anoInvalido: 'Taxa não aplicável: O ano da transferência deve estar entre 2020 e 2100.' };
    }
    return null;
  }

  public getControl(campo: string): AbstractControl | null {
    return this.transferenciaForm.get(campo);
  }

  public preencherFormulario(): void {
    this.transferenciaForm.setValue({
      contaOrigem: '1234567890',
      contaDestino: '0987654321',
      valor: 1000.0,
      dataTransferencia: '2025-02-10',
    });
  }

  public filtrarNumeros(event: any): void {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
  }

  private resetarFormulario(): void {
    this.transferenciaForm.reset();
    this.transferenciaForm.markAsPristine();
    this.transferenciaForm.markAsUntouched();
  }
}
