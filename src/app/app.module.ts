import { BankResolver } from './_resolvers/bank.resolver';
import { CurrencyResolver } from './_resolvers/currency-reolver.resolver';
import { AreaResolver } from './_resolvers/area-reolver.resolver';
import { CountryResolver } from './_resolvers/country-reolver.resolver';
import { CityResolver } from './_resolvers/city-reolver.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';

// App views
import { DashboardsModule } from './views/dashboards/dashboards.module';
import { AppviewsModule } from './views/appviews/appviews.module';

// App modules/components
import { LayoutsModule } from './components/common/layouts/layouts.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LockUpResolver } from './_resolvers/lockup-reolver.resolver';
import { BankBranchResolver } from './_resolvers/BankBranch.resolver';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DashboardsModule,
    LayoutsModule,
    AppviewsModule,
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule,

  ],
  // tslint:disable-next-line:max-line-length
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    LockUpResolver,
    CityResolver,
    CountryResolver,
    AreaResolver,
    CurrencyResolver,
    BankResolver,
    BankBranchResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
