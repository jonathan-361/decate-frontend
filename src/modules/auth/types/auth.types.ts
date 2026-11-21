// Tipos espejo de lo que devuelve el backend

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { campo: string; mensaje: string }[];
}

export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  correo: string;
}

export interface LoginPayload {
  correo: string;
  password: string;
}

export interface RegistroPayload {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  matricula: number;
  correo: string;
  password: string;
}
