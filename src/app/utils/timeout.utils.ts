/**
 * Helper đơn giản để xử lý timeout cho socket callback API
 */

/**
 * Chuyển callback API thành Promise có timeout
 * Dùng cho socket.io emit với callback
 * 
 * @example
 * timeoutPromise(
 *   (callback) => socket.emit('event', data, callback),
 *   30000 // timeout 30s
 * )
 */
export function timeoutPromise<T>(
  callbackFn: (callback: (response: T) => void) => void,
  timeoutMs: number = 30000
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const promise = new Promise<T>((resolve, reject) => {
    // Timeout
    timeoutId = setTimeout(() => {
      reject(new Error("Request timeout - Vui lòng thử lại"));
    }, timeoutMs);

    // Gọi callback API
    callbackFn((response) => {
      clearTimeout(timeoutId);
      resolve(response);
    });
  });

  return promise;
}
