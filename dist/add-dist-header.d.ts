//! add-dist-header v1.2.1 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

export type Settings = {
    dist: string;
    extension: string | null;
    delimiter: string;
    replaceComment: boolean;
    setVersion: boolean;
};
export type Options = Partial<Settings>;
export type Result = {
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
