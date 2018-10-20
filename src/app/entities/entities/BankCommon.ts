import { IPhoneCode } from '../interfaces/IPhoneCode';
import { IPhoning } from '../interfaces/IPhoning';
import { IBase } from '../interfaces/IBase';
import { CommonCurBank } from './CommonCurBank';

export class BankCommon extends CommonCurBank implements IPhoneCode, IPhoning , IBase {
    ID: number;
    PHONE: string;
    PHONE_CODE: string;
}
