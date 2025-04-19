export const enum EDeviceTypes {
    Light = 'Light',
    TemperatureSensor = 'TemperatureSensor',
}

export interface IDeviceBaseResult<T extends EDeviceTypes> {
    readonly type: T
    readonly name: string
    readonly value: number
    readonly error?: string | null
}
