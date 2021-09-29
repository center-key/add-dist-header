//! add-dist-header v0.0.2 ~ github:center-key/add-dist-header ~ MIT License

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
