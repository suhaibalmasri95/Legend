
import { CoreService } from './../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Country } from '../entities/models/country';


@Injectable()
export class CountryResolver implements Resolve<Country[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Country[]> {
        return this.coreService.loadCountries().pipe(
            catchError(error => {
                this.router.navigate(['']);
                return of(null);
            })
        );
    }
}
