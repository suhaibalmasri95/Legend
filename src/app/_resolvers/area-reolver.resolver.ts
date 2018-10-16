import { Area } from './../models/Area';
import { CoreService } from '../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class AreaResolver implements Resolve<Area[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Area[]> {
        return this.coreService.loadAreas().pipe(
            catchError(error => {
                this.router.navigate(['/banks']);
                return of(null);
            })
        );
    }
}
