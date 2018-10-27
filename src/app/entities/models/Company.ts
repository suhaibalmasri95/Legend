import { Common } from '../entities/Common';

export class Company extends Common {
    PHONE: string;
    COUNTRY_CODE: string;
    MOBILE: string;
    FAX: string;
    EMAIL: string;
    WEBSITE: string;
    ADDRESS: string;
    ADDRESS2: string;
    CODE: string;
    ST_CUR_CODE: string;
    ST_CNT_ID: number;
    LOGO: string;
    PASS_MLENGH: number;
    PASS_MUPPER: number;
    PASS_MLOWER: number;
    PASS_MDIGITS: number;
    PASS_MSPECIAL: number;
    PASS_EXPIRY_PERIOD: number;
    PASS_LOGATTEMPTS: number;
    PASS_REPEAT: number;
}
