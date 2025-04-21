import type { BinaryValue } from 'onoff'
import type { EDeviceTypes, IDeviceBaseResult } from './IBaseDeviceResult.types.ts'

export interface IGPIODeviceResult extends IDeviceBaseResult<EDeviceTypes.Gpio> {
    value: BinaryValue
}

export interface IGPIODevice {
    readonly name: string
    connect(): Promise<void>
    read(): Promise<IGPIODeviceResult>
    write(value: BinaryValue): Promise<IGPIODeviceResult>
    release(): Promise<void>
}
