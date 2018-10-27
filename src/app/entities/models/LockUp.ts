import { Common } from '../entities/Common';

export class LockUp extends Common {
    MAJOR_CODE: number;
    MINOR_CODE: number;
    ST_LOCKUP_ID: number;
    CREATED_BY: String;
    CREATION_DATE: Date;
    MODIFIED_BY: string;
    MODIFICATION_DATE: Date;
    LOCKUP_TYPE: number;
    REF_NO: string;
}
