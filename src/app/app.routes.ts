import { CountryResolver } from './_resolvers/country-reolver.resolver';
import { LockUpResolver } from './_resolvers/lockup-reolver.resolver';
import { Routes } from '@angular/router';
import { Dashboard1Component } from './views/dashboards/dashboard1.component';
import { StarterViewComponent } from './views/appviews/starterview.component';
import { LoginComponent } from './views/appviews/login.component';
import { BlankLayoutComponent } from './components/common/layouts/blankLayout.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import { CurrencyResolver } from './_resolvers/currency-reolver.resolver';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'starterview', pathMatch: 'full' },

  // App views
  {
    path: 'dashboards', component: BasicLayoutComponent,
    children: [
      { path: 'dashboard1', component: Dashboard1Component }
    ]
  },
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {
        path: 'starterview', component: StarterViewComponent,
        resolve: {
          lockUp: LockUpResolver,
          country: CountryResolver,
          currencies: CurrencyResolver
        }
      }
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
