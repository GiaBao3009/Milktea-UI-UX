export interface SocketResponse<T = unknown> {
  res_code: number;
  error_cont?: string;
  data?: T;
}
