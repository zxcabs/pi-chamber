export default function wait(time: number, signal?: AbortSignal): Promise<void> {
    if (typeof time !== 'number' || time < 0) {
        throw new TypeError('Time must be a non-negative number')
    }

    return new Promise((rs, rj) => {
        if (signal?.aborted) {
            rj(new DOMException('Aborted', 'AbortError'))
            return
        }

        const onAbort = () => {
            cleanup()
            rj(new DOMException('Aborted', 'AbortError'))
        }

        const cleanup = () => {
            clearTimeout(timerId as NodeJS.Timeout)
            signal?.removeEventListener('abort', onAbort)
        }

        const timerId = setTimeout(() => {
            cleanup()
            rs()
        }, time)

        signal?.addEventListener('abort', onAbort)
    })
}
