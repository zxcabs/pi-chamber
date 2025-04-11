export interface ITemperatureSensorReadResult {
    type: 'TemperatureSensor',
    name: string,
    value: number,
    error: string | null
}

export interface ITemperatureSensor {
    connect(): Promise<void>,
    read(): Promise<ITemperatureSensorReadResult>,
    release(): Promise<void>
}