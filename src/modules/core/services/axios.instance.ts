import axios, { type AxiosRequestConfig, type AxiosError } from "axios";

const baseURL = import.meta.env.VITE_BASE_API_URL as string;

const publicPaths: string[] = [];

let getToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export const setTokenGetter = (fn: () => string | null) => {
  getToken = fn;
};

export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

export const apiService = axios.create({
  baseURL,
  // ?ids=1&ids=2 en lugar de ?ids[]=1&ids[]=2
  paramsSerializer: { indexes: null },
});

apiService.interceptors.request.use((request) => {
  const isPublic = publicPaths.some((path) => request.url?.includes(path));
  const token = getToken();

  if (!isPublic && token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

apiService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export const get = async <T>(url: string, config?: AxiosRequestConfig) =>
  (await apiService.get<T>(url, config)).data;

export const post = async <T, D = unknown>(url: string, data?: D) =>
  (await apiService.post<T>(url, data)).data;

export const put = async <T, D = unknown>(url: string, data?: D) =>
  (await apiService.put<T>(url, data)).data;

export const patch = async <T, D = unknown>(url: string, data?: D) =>
  (await apiService.patch<T>(url, data)).data;

export const remove = async <T = void>(
  url: string,
  config?: AxiosRequestConfig,
) => (await apiService.delete<T>(url, config)).data;
