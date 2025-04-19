/**
 * Converts a callback-style function to a Promise
 * @param fn Function that accepts a callback (error, result)
 * @returns Promise that resolves with the result or rejects with the error
 */
export default function callbackAsyncWrapper<T>(
    fn: (callback: (error?: Error, result?: T) => void) => void,
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        fn((error, result) => {
            error ? reject(error) : resolve(result as T)
        })
    })
}
