import { CommonCurBank } from '../entities/CommonCurBank';
import { IStatusDate } from '../interfaces/IStatusDate';

export class Currency extends CommonCurBank implements IStatusDate {
    STATUS_DATE: Date;
    DECIMAL_PLACES: number;
    STATUS: number;
    SIGN: string;
    IS_DELETED: number;
    FRACT_NAME: string;
    FRACT_NAME2: string;
}
