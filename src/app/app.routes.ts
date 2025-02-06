import { Routes } from '@angular/router';
import {TransferenciasComponent} from './pages/transferencias/transferencias.component';

export const routes: Routes = [
  { path: '', component: TransferenciasComponent },
  { path: '**', redirectTo: '' }
];
