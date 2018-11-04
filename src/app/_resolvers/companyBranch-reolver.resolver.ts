
import { CoreService } from '../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CompanyBranches } from '../entities/models/CompanyBranches';


@Injectable()
export class CompanyBranchResolver implements Resolve<CompanyBranches[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<CompanyBranches[]> {
        return this.coreService.loadCopmanyBrancehs().pipe(
            catchError(error => {
                this.router.navigate(['']);
                return of(null);
            })
        );
    }
}
