import * as loader from "ts-loader";

export interface PluginOpts {
    enhanceAppFiles?: string | string[];
    loaderOptions?: Partial<loader.Options>;
}
