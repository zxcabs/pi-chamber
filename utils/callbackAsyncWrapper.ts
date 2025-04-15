export default function callbackAsyncWrapper(fn: (handler: (err?: Error, result?: any) => void) => void): Promise<any> {
    return new Promise((rs, rj) => {
        fn((err, data) => {
            if (err) {
                rj(err)
            } else {
                rs(data)
            }
        })
    })
}
