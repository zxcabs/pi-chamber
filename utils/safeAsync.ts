export default async function safeAsync<T>(
    promise: Promise<T> | undefined,
): Promise<{ success: true; data: T } | { success: false; error: Error }> {
    if (!promise) {
        return {
            success: false,
            error: new Error('Promise is undefined'),
        }
    }

    try {
        const data: T = await promise
        return {
            success: true,
            data,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
        }
    }
}
