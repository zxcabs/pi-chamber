export const enum EDeviceTypes {
    GPIO = 'gpio',
    PWM = 'pwm',
    TemperatureSensor = 'TemperatureSensor',
}

export interface IDeviceBaseResult<Type extends EDeviceTypes, TValue> {
    readonly type: Type
    readonly name: string
    readonly time: number
    readonly value: TValue
    readonly error?: string | null
}

export interface IDeviceBase<TValue, TResult> {
    readonly name: string
    connect(): Promise<void>
    read(): Promise<TResult>
    write(value: TValue): Promise<TResult>
    release(): Promise<void>
}
