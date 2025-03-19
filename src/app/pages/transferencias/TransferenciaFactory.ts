import { format } from 'date-fns';
import { Transferencia } from './transferencia.model';
import { FormGroup } from '@angular/forms';

export class TransferenciaFactory {

  static criarTransferencia(form: FormGroup): Transferencia {
    const dataTransferencia = this.formatarDataTransferencia(form.get('dataTransferencia')?.value);
    return {
      id: this.gerarIdTransferencia(),
      contaOrigem: form.get('contaOrigem')?.value,
      contaDestino: form.get('contaDestino')?.value,
      valor: form.get('valor')?.value,
      taxa: 12.00,
      dataTransferencia: format(dataTransferencia, 'yyyy-MM-dd'),
      dataAgendamento: format(new Date(), 'yyyy-MM-dd'),
    };
  }

  private static formatarDataTransferencia(data: string): Date {
    const dataTransferencia = new Date(data);
    dataTransferencia.setMinutes(dataTransferencia.getMinutes() + dataTransferencia.getTimezoneOffset());
    return dataTransferencia;
  }

  private static gerarIdTransferencia(): number {
    return Math.floor(Math.random() * 1000);
  }
}
