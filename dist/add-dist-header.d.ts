//! add-dist-header v1.3.0 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

export type Settings = {
    allFiles: boolean;
    dist: string;
    extension: string | null;
    delimiter: string;
    replaceComment: boolean;
    setVersion: boolean;
};
export type Result = {
    valid: boolean;
    text: boolean;
    dist: string;
    header: string | null;
    source: string;
    file: string;
    length: number | null;
    size: string | null;
};
export type ReporterSettings = {
    quite: boolean;
};
declare const addDistHeader: {
    prepend(filename: string, options?: Partial<Settings>): Result;
    reporter(result: Result, options?: ReporterSettings): Result;
};
export { addDistHeader };
