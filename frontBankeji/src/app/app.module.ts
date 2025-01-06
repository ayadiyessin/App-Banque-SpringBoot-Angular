import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { SharedAppModule } from './core/shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HeaderComponent } from './modules/header/header.component';
import { FooterComponent } from './modules/footer/footer.component';
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { ClientComponent } from './modules/client/client.component';
import { DefaultLayoutComponent } from './modules/default-layout/default-layout.component';
import { appConfig } from './app.config';
import { CompteComponent } from './modules/compte/compte.component';
import { TransactionComponent } from './modules/transaction/transaction.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { UpdateClientComponent } from './modules/update-client/update-client.component';
import { UpdateCompteComponent } from './modules/update-compte/update-compte.component';
import { MatSortModule } from '@angular/material/sort'; 
import { NgChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ClientComponent,
    CompteComponent,
    TransactionComponent,
    DefaultLayoutComponent,
    UpdateClientComponent,
    UpdateCompteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatCardModule,
    MatTableModule,
    HttpClientModule,
    SharedAppModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    NgChartsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSortModule,
  ],
  providers: [
    ...appConfig.providers,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
