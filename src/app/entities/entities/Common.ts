import { Languages } from './Languages';
import { IBase } from '../interfaces/IBase';

export class Common extends Languages implements IBase {
    ID: number;
    selected: boolean;
}
