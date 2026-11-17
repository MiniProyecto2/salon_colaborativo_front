import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE } from "../lib/api";

export type ApiStatus = "loading" | "error" | "success";

export interface UseApiDataResult<T> {
  status: ApiStatus;
  data: T | null;
  errorMessage: string | null;
  /** true si la petición lleva más de `slowAfterMs` (arranque en frío de Render) */
  isSlow: boolean;
  retry: () => void;
}

interface Options {
  /** Tiempo límite total antes de marcar error (ms). */
  timeoutMs?: number;
  /** Tiempo tras el cual se muestra «Conectando con el servidor…» (ms). */
  slowAfterMs?: number;
}

export function useApiData<T>(path: string, options: Options = {}): UseApiDataResult<T> {
  const { timeoutMs = 45000, slowAfterMs = 2500 } = options;
  const [status, setStatus] = useState<ApiStatus>("loading");
  const [data, setData] = useState<T | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSlow, setIsSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Al reintentar se vuelve al estado de carga (así el efecto no necesita cambiar el estado al empezar).
  const retry = useCallback(() => {
    setStatus("loading");
    setErrorMessage(null);
    setIsSlow(false);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const slowTimer = window.setTimeout(() => setIsSlow(true), slowAfterMs);
    const timeoutTimer = window.setTimeout(() => controller.abort(), timeoutMs);

    (async () => {
      try {
        if (!API_BASE) throw new Error("config");
        const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`http-${res.status}`);
        const json = (await res.json()) as T;
        setData(json);
        setStatus("success");
      } catch (err) {
        if ((err as Error).name === "AbortError" && abortRef.current !== controller) return;
        const msg = (err as Error).message;
        setErrorMessage(
          msg === "config"
            ? "Falta configurar la dirección del servidor (VITE_API_URL)."
            : (err as Error).name === "AbortError"
            ? "El servidor tardó demasiado en responder."
            : msg.startsWith("http-5")
            ? "El servidor tuvo un problema al procesar la solicitud."
            : "No fue posible conectar con el servidor."
        );
        setStatus("error");
      } finally {
        window.clearTimeout(slowTimer);
        window.clearTimeout(timeoutTimer);
        setIsSlow(false);
      }
    })();

    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(timeoutTimer);
      controller.abort();
    };
  }, [path, attempt, slowAfterMs, timeoutMs]);

  return { status, data, errorMessage, isSlow, retry };
}
