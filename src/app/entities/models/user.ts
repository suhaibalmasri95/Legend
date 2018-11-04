
import { Common } from '../entities/Common';
import { ILanguages } from '../interfaces/ILanguages';
export class User extends Common implements ILanguages {
    Username: string;
    Effective_Date:Date;
    Expirye_Date:Date;
    Loc_Status: number;
    PASSWORD: string;
    Email: string;
    Company: string;
    User_Branches: string;
    Birth_Date:string;
    mobile:string;
    ST_COM_ID:number
}
