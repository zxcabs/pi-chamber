import type { EDeviceTypes, IDeviceBase, IDeviceBaseResult } from './IBaseDeviceResult.types.ts'

export type TPWMValue = number

export interface IPWMDeviceResult extends IDeviceBaseResult<EDeviceTypes.PWM, TPWMValue> {}
export interface IPWMDevice extends IDeviceBase<TPWMValue, IPWMDeviceResult> {}
