"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Primitive = string | number | boolean;

type Widen<T> = T extends number
  ? number
  : T extends boolean
    ? boolean
    : T extends string
      ? string
      : T;

type SchemaValue<T extends Primitive> = {
  default: T;
  parse?: (raw: string) => Widen<T>;
  serialize?: (value: Widen<T>) => string;
};

type AnySchema = Record<string, SchemaValue<Primitive>>;

type ValuesFromSchema<S extends AnySchema> = {
  [K in keyof S]: Widen<S[K]["default"]>;
};

function defaultParse(value: string, fallback: Primitive): Primitive {
  if (typeof fallback === "boolean") {
    return value === "1" || value === "true";
  }
  if (typeof fallback === "number") {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  return value;
}

function defaultSerialize(value: Primitive) {
  if (typeof value === "boolean") return value ? "1" : "0";
  return String(value);
}

/**
 * Bind calculator state to URL search params for shareable links.
 * Updates replace history (no stack spam) and skip identical serializations.
 */
export function useCalculatorParams<S extends AnySchema>(schema: S) {
  type Values = ValuesFromSchema<S>;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const initial = useMemo(() => {
    const next = {} as Values;
    (Object.keys(schema) as (keyof S)[]).forEach((key) => {
      const def = schema[key];
      const raw = searchParams.get(String(key));
      if (raw === null) {
        next[key] = def.default as Values[keyof S];
      } else {
        const parse =
          def.parse ??
          ((v: string) =>
            defaultParse(v, def.default) as Widen<S[typeof key]["default"]>);
        next[key] = parse(raw) as Values[keyof S];
      }
    });
    return next;
    // Intentionally only on mount / first searchParams snapshot
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [values, setValues] = useState<Values>(initial);

  const setParam = useCallback(
    <K extends keyof Values>(key: K, value: Values[K]) => {
      setValues((prev) => {
        if (prev[key] === value) return prev;
        return { ...prev, [key]: value };
      });
    },
    []
  );

  const setParams = useCallback((patch: Partial<Values>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    const defaults = {} as Values;
    (Object.keys(schemaRef.current) as (keyof S)[]).forEach((key) => {
      defaults[key as keyof Values] = schemaRef.current[key]
        .default as Values[keyof Values];
    });
    setValues(defaults);
  }, []);

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    (Object.keys(schemaRef.current) as (keyof S)[]).forEach((key) => {
      const def = schemaRef.current[key];
      const serialize =
        def.serialize ??
        ((v: Primitive) => defaultSerialize(v));
      const serialized = serialize(values[key as keyof Values] as Primitive);
      const defaultSerialized = serialize(def.default);
      if (serialized === defaultSerialized) {
        if (params.has(String(key))) {
          params.delete(String(key));
          changed = true;
        }
      } else if (params.get(String(key)) !== serialized) {
        params.set(String(key), serialized);
        changed = true;
      }
    });
    if (!changed) return;
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [values, pathname, router, searchParams]);

  return { values, setParam, setParams, reset };
}

/**
 * Encode/decode JSON arrays in a single query param (e.g. prepayments).
 */
export function parseJsonParam<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function serializeJsonParam(value: unknown): string {
  return JSON.stringify(value);
}
