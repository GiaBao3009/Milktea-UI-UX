const STORAGE_KEY = 'chips_admin_user';
export const API_BASE = import.meta.env.VITE_API_URL ?? '';

interface StoredUser { token?: string; branchId?: number }

function getStoredUser(): StoredUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredUser;
  } catch {}
  return {};
}

function getToken(): string {
  return getStoredUser().token ?? '';
}

/** Lấy branchId — đọc từ key riêng trước, fallback sang user object */
export function getStoredBranchId(): number | undefined {
  const direct = localStorage.getItem('chips_branch_id');
  if (direct) return Number(direct);
  return getStoredUser().branchId;
}

/** Trích danh sách từ data (array trực tiếp hoặc { rows, items, data, list }) */
export function extractRows<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.rows)) return d.rows as T[];
    if (Array.isArray(d.items)) return d.items as T[];
    if (Array.isArray(d.data)) return d.data as T[];
    if (Array.isArray(d.list)) return d.list as T[];
  }
  return [];
}

/**
 * Thêm branchId vào URL query string nếu chưa có và user đã có branchId.
 * Ví dụ: '/api/products?isActive=1' → '/api/products?isActive=1&branchId=3'
 */
function injectBranchId(path: string): string {
  const branchId = getStoredBranchId();
  if (!branchId) return path;
  if (path.startsWith('/api/branches')) return path;
  // Không inject nếu path đã có branchId
  if (path.includes('branchId=')) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}branchId=${branchId}`;
}

/**
 * Thêm branchId vào body của POST/PUT nếu chưa có.
 */
function shouldSkipBranchIdBody(path: string): boolean {
  return path.startsWith('/api/product-categories') || path.startsWith('/api/branches');
}

function injectBranchIdBody(path: string, body: unknown): unknown {
  if (shouldSkipBranchIdBody(path)) return body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  const obj = body as Record<string, unknown>;
  if ('branchId' in obj) return body; // đã có sẵn
  const branchId = getStoredBranchId();
  if (!branchId) return body;
  return { ...obj, branchId };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const branchId = getStoredBranchId();

  // Debug interceptor — xoá sau khi xác nhận hoạt động
  console.log('👉 [Interceptor] branchId từ storage:', branchId);

  const finalPath = (method === 'GET' || method === 'DELETE')
    ? injectBranchId(path)
    : path;

  const finalBody = (method === 'POST' || method === 'PUT')
    ? injectBranchIdBody(path, body)
    : body;

  console.log('👉 [Interceptor] Gửi request:', { method, url: `${API_BASE}${finalPath}`, body: finalBody });

  const res = await fetch(`${API_BASE}${finalPath}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: finalBody !== undefined ? JSON.stringify(finalBody) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = json as { message?: string; error_cont?: string; data?: { message?: string } };
    throw new Error(
      err.error_cont ?? err.message ?? (err.data as { message?: string })?.message ?? `Lỗi ${res.status}`
    );
  }

  // Auto-unwrap CustomResponseDto { res_code, data, error_cont, error_code }
  if (json && typeof json === 'object' && 'res_code' in json) {
    const dto = json as { res_code: number; data?: unknown; error_cont?: string; error_code?: string };
    if (dto.res_code !== 0) {
      throw new Error(dto.error_cont ?? dto.error_code ?? 'Lỗi API');
    }
    return dto.data as T;
  }

  return json as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
