
import { BankResolver } from './_resolvers/bank.resolver';
import { CountryResolver } from './_resolvers/country-reolver.resolver';
import { Routes } from '@angular/router';
import { CountriesComponent } from './views/appviews/countries/countries.component';
import { LoginComponent } from './views/appviews/login.component';
import { BlankLayoutComponent } from './components/common/layouts/blankLayout.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import { CurrencyResolver } from './_resolvers/currency-reolver.resolver';
import { BanksComponent } from './views/appviews/banks/banks.component';
import { LockupAndCurrencyComponent } from './views/appviews/lockupAndCurrency/lockupAndCurrency.component';
import { BankBranchResolver } from './_resolvers/BankBranch.resolver';
import { MajorCodeResolver } from './_resolvers/majorCodes.resolver';
import { LockUpResolver } from './_resolvers/lockup-reolver.resolver';

import { CityResolver } from './_resolvers/city-reolver.resolver';
import { CompanyResolver } from './_resolvers/company-reolver.resolver';
import { CompanybranchComponent } from './views/appviews/companybranch/companybranch.component';
import { CompanyBranchResolver } from './_resolvers/companyBranch-reolver.resolver';
import { UsersComponent } from './views/appviews/users/users.component';
import { UserTypesResolver } from './_resolvers/userTypes-reolver.resolver';
import { UsersResolver, GroubsResolver } from './_resolvers/users.resolver';
import { ReportsComponent } from './views/appviews/reports/reports.component';
import { MenuDetails } from './views/appviews/menuDetails/menuDetails.component';
import { GroupsComponent } from './views/appviews/groups/groups.component';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'organizations', pathMatch: 'full' },

  // Handle all other routes
  // { path: '**', redirectTo: 'organizations' },

  // App views

  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: 'organizations', component: BasicLayoutComponent,
    children: [
      {
        path: 'countries', component: CountriesComponent,
        resolve: {
          lockUp: LockUpResolver,
          country: CountryResolver,
          currencies: CurrencyResolver
        }
      },
      {
        path: 'banks', component: BanksComponent,
        resolve: {
          banks: BankResolver,
          bankBranch: BankBranchResolver,
          country: CountryResolver,
          lockUp: LockUpResolver,
          currencies: CurrencyResolver
        }
      },
      {
        path: 'lockupAndCurrency', component: LockupAndCurrencyComponent,
        resolve: {
          lockUp: LockUpResolver,
          majorCode: MajorCodeResolver,
          currencies: CurrencyResolver
        }
      },
      {
        path: 'companies', component: CompanybranchComponent,
        resolve: {
          currencies: CurrencyResolver,
          country: CountryResolver,
          company: CompanyResolver,
          city: CityResolver,
          branches: CompanyBranchResolver
        }
      },
      {
        path: 'users', component: UsersComponent,
        resolve: {
          users: UsersResolver,
          lockUp: LockUpResolver,
          company: CompanyResolver,
          country: CountryResolver,
          userTypes: UserTypesResolver,
          groups: GroubsResolver
        }
      },
      {
        path: 'reports', component: ReportsComponent,
        resolve: {
          country: CountryResolver,
        }
      }


    ]
  },

  {
    path: '', component: BasicLayoutComponent,
    children: [
      {
        path: 'menuDetails', component: MenuDetails,
        resolve: {
          lockUp: LockUpResolver,
          country: CountryResolver,
          currencies: CurrencyResolver
        }
      },
      {
        path: 'groups', component: GroupsComponent,
        resolve: {
          lockUp: LockUpResolver,
          country: CountryResolver,
        //  currencies: CurrencyResolver
        }
      }
    ]
  }
];
