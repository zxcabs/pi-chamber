import { writable, type Writable } from 'svelte/store'

const MAX_LENGTH = 50
const MIN_PERIOD = 1000

export type TChartItem = {
    time: number
}

export type TChartStore<T extends TChartItem = TChartItem> = Writable<T[]> & {
    add: (item: T) => void
}

export default function createStore<T extends TChartItem = TChartItem>(length: number = MAX_LENGTH): TChartStore<T> {
    const store = writable<T[]>([])

    const add = (item: T) => {
        store.update(current => {
            if (current.length === 0) {
                return new Array(length).fill(item)
            }

            const last = current[current.length - 1]
            const period = item.time - last.time
            const newVal = [...current]

            if (period < MIN_PERIOD) {
                newVal.pop()
                newVal.push({ ...item, time: last.time })
                return newVal
            }

            newVal.push(item)
            newVal.shift()

            return newVal
        })
    }

    return {
        ...store,
        add,
    }
}
