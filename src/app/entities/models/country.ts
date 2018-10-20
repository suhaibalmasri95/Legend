import { IPhoneCode } from '../interfaces/IPhoneCode';
import { Base } from '../entities/Base';

export class Country extends Base implements IPhoneCode {
  PHONE_CODE: string;
  ST_CUR_CODE: string;
  NATIONALITY: string;
  FLAG: string;

}
