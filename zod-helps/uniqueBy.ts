import { z } from 'zod'
import findDuplicates from '../utils/findDuplicates.ts'

export function uniqueBy<T extends Record<string, unknown>>(field: string, messagePrefix: string = '') {
    return function superRefineHandler(val: T[], ctx: z.RefinementCtx) {
        if (val?.length <= 0) {
            return
        }

        if (val.length > 0 && !(field in val[0])) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Field '${field}' does not exist on type`,
            })
            return
        }

        const duplicates = findDuplicates(val.map(item => item[field]))

        if (duplicates.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: messagePrefix
                    ? `${messagePrefix}: ${field} must be unique. Duplicates found for: ${duplicates.join(', ')}`
                    : `${field} must be unique. Duplicates found for: ${duplicates.join(', ')}`,
            })
        }
    }
}
