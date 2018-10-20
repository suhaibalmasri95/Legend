import { ICountryID } from '../interfaces/ICountryID';
import { Base } from '../entities/Base';

export class City extends Base implements ICountryID {
    ST_CNT_ID: number;
}
