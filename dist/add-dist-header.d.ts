export declare type Options = {
    filename: string;
    dist?: string;
    extension?: string;
    setVersion?: boolean;
};
export declare type Result = {
    dist: string;
    header: string;
    file: string;
    length: number;
};
declare const addDistHeader: {
    prepend(options: Options): Result;
};
export { addDistHeader };
