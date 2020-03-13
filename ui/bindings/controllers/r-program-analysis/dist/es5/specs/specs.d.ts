export interface FuncDescription {
    [paramName: string]: string;
}
export interface TypeDescription {
    noSideEffects?: string[];
    sideEffects?: {
        [name: string]: FuncDescription;
    };
}
export interface ModuleDescription extends TypeDescription {
    modules?: ModuleMap;
    types?: {
        [typeName: string]: TypeDescription;
    };
}
export interface ModuleMap {
    [moduleName: string]: ModuleDescription;
}
export declare const specs: ModuleMap;
