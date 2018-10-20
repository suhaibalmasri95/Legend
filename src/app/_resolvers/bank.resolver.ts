
import { CoreService } from '../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bank } from '../entities/models/bank';


@Injectable()
export class BankResolver implements Resolve<Bank[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Bank[]> {
        return this.coreService.loadBanks().pipe(
            catchError(error => {
                this.router.navigate(['/LockupAndCurrency']);
                return of(null);
            })
        );
    }
}
