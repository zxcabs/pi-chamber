import type { BinaryValue } from 'onoff'
import type { EDeviceTypes, IDeviceBase, IDeviceBaseResult } from './IBaseDeviceResult.types.ts'

export type TGPIOValue = BinaryValue

export interface IGPIODeviceResult extends IDeviceBaseResult<EDeviceTypes.GPIO, TGPIOValue> {}
export interface IGPIODevice extends IDeviceBase<TGPIOValue, IGPIODeviceResult> {}
