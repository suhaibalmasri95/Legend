
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StarterViewComponent } from './starterview.component';
import { LoginComponent } from './login.component';
import { SparklineModule } from '../../components/charts/sparkline';
import { PeityModule } from '../../components/charts/peity';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatTabsModule, MatInputModule } from '@angular/material';
import { MatSortModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BanksComponent } from './banks/banks.component';
import { LockupAndCurrencyComponent } from './lockupAndCurrency/lockupAndCurrency.component';

@NgModule({
  declarations: [
    LoginComponent,
    StarterViewComponent,
    BanksComponent,
    LockupAndCurrencyComponent
  ],
  imports: [
    RouterModule,
    PeityModule,
    SparklineModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    HttpClientModule,
    BrowserModule,
    DataTablesModule,
    NgbModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    MatDividerModule,
    MatCheckboxModule
  ],
  exports: [
    StarterViewComponent,
    LoginComponent
  ],
})

export class AppviewsModule {
}
