import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ClientComponent } from './modules/client/client.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { DefaultLayoutComponent } from './modules/default-layout/default-layout.component';
import { authGuard } from 'src/Guard/auth.guard';
import { CompteComponent } from './modules/compte/compte.component';
import { TransactionComponent } from './modules/transaction/transaction.component';
import { UpdateClientComponent } from './modules/update-client/update-client.component';
import { UpdateCompteComponent } from './modules/update-compte/update-compte.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', component: DashboardComponent },
      { path: 'client', component: ClientComponent },
      { path: 'compte/:id', component: CompteComponent },
      { path: 'transaction/:id', component: TransactionComponent },
      { path: 'updateclient/:id', component: UpdateClientComponent },
      { path: 'updatecompte/:id', component: UpdateCompteComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
