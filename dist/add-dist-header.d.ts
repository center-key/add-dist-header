//! add-dist-header v0.3.4 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

export declare type Settings = {
    dist: string;
    extension: string | null;
    delimiter: string;
    replaceComment: boolean;
    setVersion: boolean;
};
export declare type Options = Partial<Settings>;
export declare type Result = {
    valid: boolean;
    dist: string;
    header: string;
    source: string;
    file: string;
    length: number;
    size: string;
};
declare const addDistHeader: {
    prepend(filename: string, options?: Options): Result;
};
export { addDistHeader };
