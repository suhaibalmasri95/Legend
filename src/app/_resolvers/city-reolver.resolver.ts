
import { CoreService } from './../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { City } from '../entities/models/City';


@Injectable()
export class CityResolver implements Resolve<City[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<City[]> {
        return this.coreService.loadCities().pipe(
            catchError(error => {
                this.router.navigate(['']);
                return of(null);
            })
        );
    }
}
