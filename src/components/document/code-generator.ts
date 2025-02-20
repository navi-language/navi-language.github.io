import type {
  Field,
  FunctionSymbol,
  GlobalVarSymbol,
  Type,
  TypeSymbol,
} from "../../types";
import { escape } from "../../utils";

/**
 * Escape HTML
 * @param text
 * @returns
 */
function h(text: string): string {
  return escape(text);
}

function link(text: string, href?: string, opts?: { class?: string }): string {
  const classAttr = opts?.class ? ` class="${opts.class}"` : "";
  if (!href) {
    if (opts?.class) {
      return `<span${classAttr}>${text}</span>`;
    }

    return text;
  }

  return `<a href="${href}"${classAttr}>${text}</a>`;
}

interface PrinterItem {
  toString(): string;
}

function genCodeToHTML(item: PrinterItem): string {
  return item.toString();
}

function seq(...items: PrinterItem[]): string {
  return items.map((item) => item.toString()).join("");
}

/**
 * Generate HTML with token highlighting
 * @param ty
 * @param name
 * @returns
 */
function token(
  ty: "keyword" | "self" | "fn" | "variable" | "const" | "type" | "argument",
  name: string,
): string {
  return `<span class="_nv_token_${ty}">${h(name)}</span>`;
}

function span(text: string): string {
  return h(text);
}

export class CodeGenerator {
  moduleURL(module: string, symbol?: string): string {
    const basePath = module.startsWith("std.") ? "/stdlib/" : "/pkg/";

    let symbolSuffix = symbol ? `.${symbol}` : "";
    if (module) {
      return `${basePath}${module}${symbolSuffix}`;
    } else {
      return `/stdlib/${symbol}`;
    }
  }

  /**
   * Get the name for a `type`
   * @param type
   * @param param1
   * @returns
   */
  genType(name: string, symbol: TypeSymbol): string {
    if (!symbol.kind) {
      return "";
    }

    const sign = () => {
      switch (symbol.kind) {
        case "type":
          if (symbol.value_type?.type == "new_type" || symbol.source_type) {
            if (symbol.alias) {
              return "type alias";
            }

            return "type";
          }

          return symbol.value_type?.type || "type";

        default:
          return symbol.kind;
      }
    };

    let suffix = "";
    if (symbol.source_type) {
      suffix = seq(` `, `=`, ` `, this._type(symbol.source_type));
    }

    const href = symbol.id
      ? `${symbol.module?.basePath || ""}${symbol.id}`
      : "";

    return seq(
      token("keyword", sign()),
      " ",
      link(token("type", name), href),
      suffix,
    );
  }

  _type(type: Type): string {
    const getText = () => {
      switch (type.type) {
        case "struct":
        case "enum":
        case "interface":
        case "new_type":
          const s = `${type.module}.${type.name}`;
          switch (s) {
            case "std.str.string":
              return {
                name: "string",
                module: "std.str",
                symbol: "string",
              };
            case "std.any.Any":
              return {
                name: "Any",
                module: "std.any",
                symbol: "string",
              };
            default:
              return {
                name: type.name,
                module: type.module,
                symbol: type.name,
              };
          }
        case "bool":
          return {
            name: "bool",
            symbol: "bool",
            module: "",
          };
        case "char":
          return {
            name: "char",
            symbol: "char",
            module: "",
          };
        case "float":
          return {
            name: "float",
            symbol: "float",
            module: "",
          };
        case "generic":
          return `T`;
        case "int":
          return {
            name: "int",
            symbol: "int",
            module: "",
          };
        case "optional":
          return seq(this._type(type.element), span("?"));
        case "array":
          return seq(span("["), this._type(type.element), span("]"));
        case "map":
          return seq(
            span("<"),
            this._type(type.key),
            span(", "),
            this._type(type.value),
            span(">"),
          );
        case "channel":
          return seq(
            token("keyword", "channel"),
            span("::"),
            span("<"),
            this._type(type.element),
            span(">"),
          );
        case "closure":
          let args = `|(${type.arguments
            .map((t) => this._type(t))
            .join(span(", "))})|`;
          let returns = type.return_type
            ? seq(span(": "), this._type(type.return_type))
            : "";

          return args + returns;
        case "union":
          return type.types.map((t) => this._type(t)).join(span(" | "));
        case "worker_pool":
          return seq(
            token("type", "WorkerPool"),
            span("<"),
            this._type(type.req),
            span(", "),
            this._type(type.rep),
            span(">"),
          );
        default:
          throw `unimplemented: ${JSON.stringify(type)}`;
      }
    };

    let text = getText();
    if (typeof text === "string") {
      return text;
    }

    return link(
      token("type", text.name),
      this.moduleURL(text.module, text.symbol),
    );
  }

  genFn(
    name: string,
    symbol: FunctionSymbol,
    kind: "fn" | "method" = "method",
  ) {
    const args = symbol.arguments.map((arg) => {
      switch (arg.type) {
        case "keyword":
          let defaultValue =
            arg.default_value.length > 0 ? seq(" = ", arg.default_value) : "";
          return seq(
            token("argument", arg.name),
            span(": "),
            this._type(arg.value_type),
            defaultValue,
          );
        case "self":
          return token("self", "self");
        case "arbitrary":
          return seq(
            token("argument", arg.name),
            span(": .."),
            this._type(arg.value_type),
          );
        default:
          return seq(
            token("argument", arg.name),
            span(": "),
            this._type(arg.value_type),
          );
      }
    });

    let throws = "";
    if (symbol.throws) {
      let throws_types = symbol.throws.map((t) => this._type(t));
      throws = seq(
        span(" "),
        token("keyword", "throws"),
        throws_types.length > 0 ? span(" ") : "",
        throws_types.join(span(", ")),
      );
    }

    let generics = "";
    if (symbol.generic_params && symbol.generic_params.length > 0) {
      generics = seq(
        span("<"),
        symbol.generic_params.join(span(", ")),
        span(">"),
      );
    }

    let return_type = symbol.return_type
      ? seq(span(":"), span(" "), this._type(symbol.return_type))
      : "";

    const anchor = `${kind}.${name}`;
    return genCodeToHTML(
      seq(
        `<span id="${anchor}" />`,
        token("keyword", "pub"),
        span(" "),
        token("keyword", "fn"),
        span(" "),
        link(token("fn", name), `#${anchor}`),
        generics,
        span("("),
        args.join(span(", ")),
        span(")"),
        return_type,
        throws,
      ),
    );
  }

  genField(field: Field) {
    const anchor = `field.${field.name}`;
    return seq(
      `<span id="${anchor}" />`,
      link(token("variable", field.name), `#${anchor}`),
      span(": "),
      this._type(field.value_type),
    );
  }

  genImplFor(interface_: Type, for_: Type) {
    return seq(
      token("keyword", "impl"),
      span(" "),
      this._type(interface_),
      span(" "),
      token("keyword", "for"),
      span(" "),
      this._type(for_),
    );
  }

  genImplementations(impls: Type[]): string {
    return impls.map((impl) => this._type(impl)).join(span(" "));
  }

  genGlobalVar(name: string, symbol: GlobalVarSymbol) {
    const anchor = `${name}`;
    return seq(
      `<span id="${anchor}" />`,
      token("keyword", "pub"),
      span(" "),
      token("keyword", symbol.is_const ? "const" : "let"),
      span(" "),
      link(token("const", name), `#${anchor}`),
      span(": "),
      this._type(symbol.value_type),
    );
  }
}

export const codeGenerator = new CodeGenerator();
