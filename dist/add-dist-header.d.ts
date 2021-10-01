//! add-dist-header v0.1.0 ~ https://github.com/center-key/add-dist-header ~ MIT License

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
    size: string;
};
declare const addDistHeader: {
    prepend(options: Options): Result;
};
export { addDistHeader };
