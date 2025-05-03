import type { THeatingProgram } from '../../../heating-pogram/HeatingProgram.ts'
import {
    type TRequestPayload as TStartPayload,
    type TResponsePayload as TStartResult,
} from '../../../msg-schema/StartShedulerTask.ts'
import {
    type TRequestPayload as TStopPayload,
    type TResponsePayload as TStopResult,
} from '../../../msg-schema/StopShedulerTask.ts'

import type HeatingChamber from './HeatingChamber.ts'

export default class HeatingChamberSheduler {
    private program?: THeatingProgram
    private currentIntervalIndex: number = -1
    private startTime: number = 0
    private remainingTime: number = 0
    private timer: NodeJS.Timeout | null = null
    private isRunning: boolean = false

    constructor(private ctx: HeatingChamber) {}

    get running() {
        return this.isRunning
    }

    public async start(data: TStartPayload): Promise<TStartResult> {
        if (this.isRunning) {
            throw new Error('Already running')
        }

        if (data?.program?.intervals?.length === 0) {
            throw new Error('Program intervals not present')
        }

        this.program = data.program
        this.isRunning = true

        this.startInterval()

        return {
            chamber: this.ctx.name,
        }
    }

    public async stop(): Promise<TStopResult> {
        this.clear()

        return {
            chamber: this.ctx.name,
        }
    }

    public async release() {
        await this.stop()
    }

    private startInterval() {
        this.currentIntervalIndex += 1
        this.startTime = Date.now()
        const currentInterval = this.program?.intervals[this.currentIntervalIndex]

        if (!currentInterval) {
            this.stop()
            return
        }

        const execute = () => {
            if (!this.isRunning) return
            const now = Date.now()
            const remainingTime = currentInterval.duration - (now - this.startTime)

            if (remainingTime <= 0) return this.startInterval()

            this.ctx.setTemperature(currentInterval.temperature)

            this.timer = setTimeout(execute, 1000)
        }

        execute()
    }

    private clear() {
        this.program = undefined
        this.isRunning = false
        this.currentIntervalIndex = -1
        this.startTime = 0
        this.ctx.setTemperature(0)

        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
}
