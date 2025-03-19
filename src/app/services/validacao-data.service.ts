import {AbstractControl} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoDataService {

  public validarData(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;

    const dataSelecionada = new Date(control.value + 'T00:00:00');
    const hoje = this.obterHojeSemHora();
    const maxDias = this.obterMaxDias(hoje, 50);

    const erros = this.validarDataTransferencia(dataSelecionada, hoje, maxDias);
    if (erros.length) {
      return { dataInvalida: 'Data inválida, deve ser entre hoje e 50 dias à frente.' };
    }
    return null;
  }

  private obterHojeSemHora(): Date {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje;
  }

  private obterMaxDias(hoje: Date, dias: number): Date {
    const maxDias = new Date(hoje);
    maxDias.setDate(hoje.getDate() + dias);
    return maxDias;
  }

  private validarDataTransferencia(dataSelecionada: Date, hoje: Date, maxDias: Date): string[] {
    const erros: string[] = [];

    if (dataSelecionada < hoje) {
      erros.push('A data de transferência não pode ser anterior à data atual.');
    }
    if (dataSelecionada > maxDias) {
      erros.push('A data de transferência deve ser no máximo 50 dias após a data de agendamento.');
    }
    if (dataSelecionada.getFullYear() < 2020 || dataSelecionada.getFullYear() > 2100) {
      erros.push('O ano da transferência deve estar entre 2020 e 2100.');
    }

    return erros;
  }
}
