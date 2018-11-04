
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
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
import { CompanybranchComponent } from './companybranch/companybranch.component';
import { UsersComponent } from './users/users.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReportsComponent } from './reports/reports.component';
import { MenuDetails } from './menuDetails/menuDetails.component';
import { GroupsComponent } from './groups/groups.component';

@NgModule({
  declarations: [
    LoginComponent,
    CountriesComponent,
    BanksComponent,
    LockupAndCurrencyComponent,
    CompanybranchComponent,
    UsersComponent,
    ReportsComponent,
    MenuDetails,
    GroupsComponent
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
    MatCheckboxModule,
    NgMultiSelectDropDownModule.forRoot()

  ],
  exports: [
    CountriesComponent,
    LoginComponent
  ],
})

export class AppviewsModule {
}
