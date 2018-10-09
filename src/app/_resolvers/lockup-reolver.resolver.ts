import { LockUp } from '../models/LockUp';
import { CoreService } from '../_services/CoreServices.service';
import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class LockUpResolver implements Resolve<LockUp[]> {
    constructor(private coreService: CoreService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<LockUp[]> {
        return this.coreService.LoadLockUpsByMajorCode().pipe(
            catchError(error => {
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}
