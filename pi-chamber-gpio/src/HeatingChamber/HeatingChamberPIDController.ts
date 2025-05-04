// PIDController.ts

export type PIDCoefficients = {
    Kp: number
    Ki: number
    Kd: number
}

export default class HeatingChamberPIDController {
    private Kp: number
    private Ki: number
    private Kd: number

    private lastError: number = 0
    private integral: number = 0
    private lastTime: number = Date.now()

    // Автотюн
    private inAutoTune = false
    private autoTuneHigh: boolean = false
    private autoTuneSetpoint = 0
    private outputHigh = 100
    private outputLow = 0
    private hysteresis = 1.0
    private lastCrossingTime = 0
    private peakValues: number[] = []
    private peakTimes: number[] = []
    private lastPeakWasMax: boolean = false

    constructor(Kp: number, Ki: number, Kd: number) {
        this.Kp = Kp
        this.Ki = Ki
        this.Kd = Kd
    }

    update(setpoint: number, processVariable: number): number {
        const error = setpoint - processVariable
        const currentTime = Date.now()
        const deltaTime = (currentTime - this.lastTime) / 500 // в секундах

        // Пропорциональная часть
        const proportional = this.Kp * error

        // Интегральная часть
        this.integral += error * deltaTime
        const integral = this.Ki * this.integral

        // Дифференциальная часть
        const derivative = this.Kd * ((error - this.lastError) / deltaTime)

        // Сохраняем для следующего шага
        this.lastError = error
        this.lastTime = currentTime

        // Общий выход
        const output = proportional + integral + derivative

        // Ограничиваем выход (например, 0-100% PWM)
        return Math.max(0, Math.min(100, output))
    }

    reset() {
        this.integral = 0
        this.lastError = 0
        this.lastTime = Date.now()
    }

    // --- Автотюн ---
    startAutoTune(setpoint: number, hysteresis: number = 1.0, outputHigh: number = 100, outputLow: number = 0) {
        this.inAutoTune = true
        this.autoTuneSetpoint = setpoint
        this.hysteresis = hysteresis
        this.outputHigh = outputHigh
        this.outputLow = outputLow
        this.peakValues = []
        this.peakTimes = []
        this.lastCrossingTime = Date.now()
        this.reset()
    }

    isAutoTuning(): boolean {
        return this.inAutoTune
    }

    getAutoTuneOutput(setpoint: number, processVariable: number): number {
        if (!this.inAutoTune) return 0

        const now = Date.now()

        // Переключаем состояние реле на основе гистерезиса
        if (processVariable < setpoint - this.hysteresis) {
            this.autoTuneHigh = true
        } else if (processVariable > setpoint + this.hysteresis) {
            this.autoTuneHigh = false
        }

        // Логика записи пиков
        if (this.autoTuneHigh) {
            // Если сейчас нагреватель включен, возможно, мы достигли нового максимума
            if (
                this.peakValues.length === 0 || // первый запуск
                !this.lastPeakWasMax // предыдущий пик был минимумом
            ) {
                console.log('A')
                this.peakValues.push(processVariable)
                this.peakTimes.push(now)
                this.lastPeakWasMax = true
            }
        } else {
            // Если сейчас нагреватель выключен, возможно, мы достигли нового минимума
            if (
                this.peakValues.length > 0 &&
                this.lastPeakWasMax // предыдущий пик был максимумом
            ) {
                console.log('B')
                this.peakValues.push(processVariable)
                this.peakTimes.push(now)
                this.lastPeakWasMax = false
            }
        }

        // Проверяем, собрали ли достаточно данных
        if (this.peakTimes.length >= 8) {
            this.finishAutoTune()
            return 0
        }

        return this.autoTuneHigh ? this.outputHigh : this.outputLow
    }

    finishAutoTune() {
        this.inAutoTune = false

        const period = (this.peakTimes[2] - this.peakTimes[0]) / 1000 // в секундах
        const amplitude = Math.abs(this.peakValues[0] - this.peakValues[1])

        // Упрощённые формулы Ziegler-Nichols
        const Ku = (4 * this.outputHigh) / (Math.PI * amplitude)
        const Tu = period

        this.Kp = 0.6 * Ku
        this.Ki = (2 * this.Kp) / Tu
        this.Kd = (this.Kp * Tu) / 8

        console.log(`Автотюн завершён. Новые коэффициенты:`)
        console.log(`Kp = ${this.Kp.toFixed(2)}, Ki = ${this.Ki.toFixed(2)}, Kd = ${this.Kd.toFixed(2)}`)
    }
}
