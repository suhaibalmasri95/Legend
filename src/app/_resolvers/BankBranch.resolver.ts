
import { CoreService } from '../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BankBranches } from '../entities/models/BankBranches';


@Injectable()
export class BankBranchResolver implements Resolve<BankBranches[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BankBranches[]> {
        return this.coreService.loadBranchs().pipe(
            catchError(error => {
                this.router.navigate(['/LockupAndCurrency']);
                return of(null);
            })
        );
    }
}
