import type { EDeviceTypes, IDeviceBaseResult } from './IBaseDeviceResult.types.ts'

export interface ITemperatureSensorReadResult extends IDeviceBaseResult<EDeviceTypes.TemperatureSensor, number> {}

export interface ITemperatureSensor {
    readonly name: string
    connect(): Promise<void>
    read(): Promise<ITemperatureSensorReadResult>
    release(): Promise<void>
}
