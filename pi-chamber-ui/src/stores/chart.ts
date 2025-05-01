import { writable, type Writable } from 'svelte/store'

const MAX_LENGTH = 100

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

            current.push(item)

            if (current.length >= length) {
                current.shift()
            }

            return current
        })
    }

    return {
        ...store,
        add,
    }
}
