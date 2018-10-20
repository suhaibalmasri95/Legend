import { Languages } from './Languages';
import { ICurrencyCode } from '../interfaces/ICurrencyCode';

export class CommonCurBank extends Languages implements ICurrencyCode  {
    CODE: string;
    selected: boolean;
}
