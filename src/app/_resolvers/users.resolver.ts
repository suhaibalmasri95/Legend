
import { CoreService } from '../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bank } from '../entities/models/bank';
import { Group } from '../entities/models/Group';


@Injectable()
export class UsersResolver implements Resolve<Bank[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Bank[]> {
        return this.coreService.loadUsers().pipe(
            catchError(error => {
             //   this.router.navigate(['/organizations']);
                return of(null);
            })
        );
    }
}
@Injectable()
export class GroubsResolver implements Resolve<Group[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Bank[]> {
        return this.coreService.loadGroups(1).pipe(
            catchError(error => {
             //   this.router.navigate(['/organizations']);
                return of(null);
            })
        );
    }
}
