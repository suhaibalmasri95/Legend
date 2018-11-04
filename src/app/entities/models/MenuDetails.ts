import { Base } from '../entities/Base';

export class System extends Base {
    ST_CNT_ID: number;
}


export class Module extends Base {
    ST_CNT_ID: number;
}

export class SubModule extends Base {
    ST_CNT_ID: number;
    ST_CTY_ID: number;
}

export class Page extends Base {
    ST_CNT_ID: number;
    ST_CTY_ID: number;
}

export class Action extends Base {
    ST_CNT_ID: number;
    ST_CTY_ID: number;
}
