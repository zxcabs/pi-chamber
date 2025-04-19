import type { BinaryValue } from 'onoff'
import type { EDeviceTypes, IDeviceBaseResult } from './IBaseDeviceResult.types.ts'

export interface ILightResult extends IDeviceBaseResult<EDeviceTypes.Light> {}

export interface ILight {
    readonly name: string
    connect(): Promise<void>
    read(): Promise<ILightResult>
    write(value: BinaryValue): Promise<ILightResult>
    release(): Promise<void>
}
