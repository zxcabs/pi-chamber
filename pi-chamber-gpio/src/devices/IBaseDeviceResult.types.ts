export const enum EDeviceTypes {
    Gpio = 'Gpio',
    TemperatureSensor = 'TemperatureSensor',
}

export interface IDeviceBaseResult<T extends EDeviceTypes> {
    readonly type: T
    readonly name: string
    readonly value: number
    readonly error?: string | null
}
