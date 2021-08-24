export interface DBResult {
    status: boolean;
    message?: string;
    results?: Result[];
}

export interface Result {
    id: number;
    name: string;
    quantity: number;
    expiry: number;
}

export interface ItemCommon {
    name: string,
    quantity: number
}

export interface Item extends ItemCommon {
    expiry: number
}