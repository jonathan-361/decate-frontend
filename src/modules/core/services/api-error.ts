import axios from "axios";
import type { ApiResponse } from "@/modules/auth/types/auth.types";

/** Mensaje legible a partir de un error de Axios con el formato ApiResponse del backend. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.data) {
    const { message, errors } = err.response.data as ApiResponse;
    if (errors?.length) return errors.map((e) => e.mensaje).join(", ");
    if (message) return message;
  }
  return err instanceof Error ? err.message : fallback;
}
