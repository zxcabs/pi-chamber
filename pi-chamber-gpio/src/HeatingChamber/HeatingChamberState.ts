import type { IGPIODeviceResult } from '../devices/types/IGPIODevice.type.ts'
import type { IPWMDeviceResult, TPWMValue } from '../devices/types/IPWMDevice.type.ts'
import type { ITemperatureSensorReadResult } from '../devices/types/ITemperatureSensor.type.ts'

export type THeatingChamberStateStatus = 'ON' | 'OFF' | 'ERROR'

export type THeatingChamberCurrentState = {
    updateAt: number
    status: THeatingChamberStateStatus
    heaterValue: TPWMValue
    fan_status: THeatingChamberStateStatus
    light_status: THeatingChamberStateStatus

    current_temperature: number
    target_temperature: number
}

export default class HeatingChamberState {
    private updateAt: number = 0

    readonly status: THeatingChamberStateStatus = 'OFF'
    readonly targetTemperature: number = 0

    readonly temperatureSensorsStatus: ITemperatureSensorReadResult[] = []
    readonly lightDevices: IGPIODeviceResult[] = []
    readonly fanDevices: IGPIODeviceResult[] = []
    readonly heaterDevices: IPWMDeviceResult[] = []

    get heaterValue(): TPWMValue {
        return this.heaterDevices.reduce((pwmAcc, pwmDevice) => pwmAcc + pwmDevice.value, 0)
    }

    get fanStatus(): THeatingChamberStateStatus {
        const { error, value } = this.fanDevices.reduce(
            (acc, fan) => {
                if (acc.error) return acc
                if (fan.error) acc.error = fan.error

                acc.value |= fan.value

                return acc
            },
            { error: '', value: 0 },
        )

        if (error) return 'ERROR'

        return value ? 'ON' : 'OFF'
    }

    get lightStatus(): THeatingChamberStateStatus {
        const { error, value } = this.lightDevices.reduce(
            (acc, light) => {
                if (acc.error) return acc
                if (light.error) acc.error = light.error

                acc.value |= light.value

                return acc
            },
            { error: '', value: 0 },
        )

        if (error) return 'ERROR'

        return value ? 'ON' : 'OFF'
    }

    get currentTemperature(): number {
        if (this.temperatureSensorsStatus.length === 0) return 0

        return (
            this.temperatureSensorsStatus.reduce((acc, temperatureStatus) => acc + temperatureStatus.value, 0) /
            this.temperatureSensorsStatus.length
        )
    }

    static updateDeviceStatus<T extends IGPIODeviceResult | IPWMDeviceResult | ITemperatureSensorReadResult>(
        arr: T[],
        newState: T,
    ) {
        const index = arr.findIndex(current => current.name === newState.name)
        if (index === -1) {
            arr.push(newState)
        } else if (arr[index].time < newState.time) {
            arr[index] = newState
        }
    }

    updateTemperatureSensorStatus(state: ITemperatureSensorReadResult) {
        HeatingChamberState.updateDeviceStatus(this.temperatureSensorsStatus, state)
        this.updateAt = Date.now()
    }

    updateLightDeviceStatus(state: IGPIODeviceResult) {
        HeatingChamberState.updateDeviceStatus(this.lightDevices, state)
        this.updateAt = Date.now()
    }

    updataFanDeviceStatus(state: IGPIODeviceResult) {
        HeatingChamberState.updateDeviceStatus(this.fanDevices, state)
        this.updateAt = Date.now()
    }

    updataHeaterDeviceStatus(state: IPWMDeviceResult) {
        HeatingChamberState.updateDeviceStatus(this.heaterDevices, state)
        this.updateAt = Date.now()
    }

    getCurrentState(): THeatingChamberCurrentState {
        return {
            updateAt: this.updateAt,
            status: this.status,
            heaterValue: this.heaterValue,
            fan_status: this.fanStatus,
            light_status: this.lightStatus,
            current_temperature: this.currentTemperature,
            target_temperature: this.targetTemperature,
        }
    }
}
