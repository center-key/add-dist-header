//! add-dist-header v0.1.6 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

export declare type Options = {
    filename: string;
    dist?: string;
    extension?: string;
    delimiter?: string;
    replaceComment?: boolean;
    setVersion?: boolean;
};
export declare type Result = {
    dist: string;
    header: string;
    file: string;
    length: number;
    size: string;
};
declare const addDistHeader: {
    prepend(options: Options): Result;
};
export { addDistHeader };
