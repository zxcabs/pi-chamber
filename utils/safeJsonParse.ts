type TSafeParseResult<T> = { success: true; data: T; error?: Error } | { success: false; error: Error }

export default function safeJsonParse<T>(jsonString: string): TSafeParseResult<T> {
    try {
        const parsedJson = JSON.parse(jsonString)

        return { success: true, data: parsedJson as T }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
        }
    }
}
