/*
 * Navi Doc Types
 */

export interface Module {
  basePath?: "/stdlib/" | "/pkg/";
  id: string;
  doc?: string;
  symbols: Record<string, Symbol>;
}

export type Symbol = TypeSymbol | FunctionSymbol | GlobalVarSymbol;

interface BaseSymbol {
  /**
   * The unique identifier of the symbol.
   *
   * Prepare in doc-json.ts
   */
  id?: string;
  /**
   * The module of the symbol.
   *
   * Prepare in doc-json.ts
   */
  module?: Module;
}
export interface TypeSymbol extends BaseSymbol {
  doc: string;
  kind: "type";
  value_type?: Type;
  implementions: Type[];

  // for struct/enum/new_type/interface
  methods: Method[];
  // For struct
  fields: Field[];
  // For enum
  items: EnumItem[];
  // for newtype, is a `type alias`
  alias: boolean;
  source_type?: Type;

  generic_params: string[];
}
export interface FunctionSymbol extends BaseSymbol {
  doc: string;
  kind: "function";
  arguments: Argument[];
  return_type?: Type;
  throws?: Type[];
  generic_params?: string[];
}
export interface GlobalVarSymbol extends BaseSymbol {
  doc: string;
  kind: "global_var";
  is_const: boolean;
  value_type: Type;
}

export interface EnumItem {
  doc: string;
  name: string;
  value?: number;
}

export interface Field {
  doc: string;
  name: string;
  value_type: Type;
  read?: boolean;
  write?: boolean;
}

export interface Method {
  doc: string;
  name: string;
  generic_params?: string[];
  arguments: Argument[];
  return_type?: Type;
  throws?: Type[];
}

export type Argument =
  | {
    type: "positional" | "arbitrary";
    name: string;
    value_type: Type;
  }
  | {
    type: "keyword";
    name: string;
    value_type: Type;
    default_value: string;
  }
  | {
    type: "self";
  };

export type Type =
  | {
    type: "struct" | "enum" | "interface" | "new_type";
    module: string;
    name: string;
  }
  | {
    type: "generic";
    index: number;
  }
  | {
    type: "bool";
  }
  | {
    type: "int";
  }
  | {
    type: "float";
  }
  | {
    type: "char";
  }
  | {
    type: "array";
    element: Type;
  }
  | {
    type: "map";
    key: Type;
    value: Type;
  }
  | {
    type: "channel";
    element: Type;
  }
  | {
    type: "worker_pool";
    req: Type;
    resp: Type;
  }
  | {
    type: "closure";
    arguments: Type[];
    return_type?: Type;
    throws?: Type[];
  }
  | {
    type: "optional";
    element: Type;
  }
  | {
    type: "union";
    types: Type[];
  };

export type Params =
  | {
    type: "module";
    title: string;
    name: string;
    id: string;
    module: Module;
  }
  | {
    type: "type";
    title: string;
    name: string;
    module: string;
    id: string;
    symbol: TypeSymbol;
  };
