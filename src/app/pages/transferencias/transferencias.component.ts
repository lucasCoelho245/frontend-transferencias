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
  public erroTaxaInaplicavel: boolean = false;

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

    const taxa = this.calcularTaxa();
    if (taxa === null) {
      this.erroTaxaInaplicavel = true;
      return;
    }

    const novaTransferencia: Transferencia = {
      id: Math.floor(Math.random() * 1000),
      contaOrigem: this.transferenciaForm.get('contaOrigem')?.value,
      contaDestino: this.transferenciaForm.get('contaDestino')?.value,
      valor: this.transferenciaForm.get('valor')?.value,
      taxa: taxa,
      dataTransferencia: format(new Date(this.transferenciaForm.get('dataTransferencia')?.value), 'yyyy-MM-dd'),
      dataAgendamento: format(new Date(), 'yyyy-MM-dd'),
    };

    this.service.criarTransferencia(novaTransferencia).subscribe({
      next: () => {
        this.carregarTransferencias();
        this.transferenciaForm.reset();
        this.erroTaxaInaplicavel = false;
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

  private validarData(control: AbstractControl): { [key: string]: any } | null {
    const dataSelecionada = new Date(control.value);
    const hoje = new Date();
    const maxDias = new Date();
    maxDias.setDate(hoje.getDate() + 50);

    if (dataSelecionada < hoje) {
      return { dataPassada: 'Taxa não aplicável: Erro - A data de transferência não pode ser anterior à data atual.' };
    }
    if (dataSelecionada > maxDias) {
      return { dataMuitoDistante: 'Taxa não aplicável: Erro - A data de transferência deve ser no máximo 50 dias após a data de agendamento.' };
    }
    if (dataSelecionada.getFullYear() < 2020 || dataSelecionada.getFullYear() > 2100) {
      return { anoInvalido: 'Taxa não aplicável: Erro - O ano da transferência deve estar entre 2020 e 2100.' };
    }
    return null;
  }

  private calcularTaxa(): number | null {
    return 12.00;
  }
}
