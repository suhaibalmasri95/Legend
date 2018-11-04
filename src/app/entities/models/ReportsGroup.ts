import { IPhoneCode } from '../interfaces/IPhoneCode';
import { Base } from '../entities/Base';

export class ReportsGroup extends Base implements IPhoneCode {
  PHONE_CODE: string;
  ST_CUR_CODE: string;
  NATIONALITY: string;
}
