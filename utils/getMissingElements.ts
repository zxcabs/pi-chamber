/**
 * Возвращает элементы из проверяемого массива, которые отсутствуют в исходном массиве
 * @param sourceArray Исходный массив (эталон для проверки)
 * @param targetArray Проверяемый массив
 * @returns Массив элементов, которые есть в targetArray, но отсутствуют в sourceArray
 */
export function getMissingElements<T>(sourceArray: T[], targetArray: T[]): T[] {
    const sourceSet = new Set(sourceArray)
    return targetArray.filter(item => !sourceSet.has(item))
}

export function getMissingElementsWithComparator<T>(
    sourceArray: T[],
    targetArray: T[],
    comparator: (a: T, b: T) => boolean = (a, b) => a === b,
): T[] {
    return targetArray.filter(targetItem => !sourceArray.some(sourceItem => comparator(sourceItem, targetItem)))
}
