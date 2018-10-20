import { Common } from './Common';
import { ILockUpStatus } from '../interfaces/ILockUpStatus';
import { IReference } from '../interfaces/IReference';
import { IStatusDate } from '../interfaces/IStatusDate';

export class Base extends Common implements ILockUpStatus , IReference , IStatusDate  {
    STATUS_DATE: Date;
    REFERNCE_NO: number;
    LOC_STATUS: number;
}
