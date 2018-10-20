import { Bank } from './bank';
import { IBankID } from '../interfaces/IBankID';
import { ICityID } from '../interfaces/ICityID';
import { ICountryID } from '../interfaces/ICountryID';

export class BankBranches extends Bank implements IBankID, ICityID, ICountryID  {
  ST_CNT_ID: number;
  ST_CITY_ID: number;
  ST_BNK_ID: number;
}
