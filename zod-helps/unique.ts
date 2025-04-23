import { z } from 'zod'
import findDuplicates from '../utils/findDuplicates.ts'

export function unique<T>(messagePrefix: string = '') {
    return function superRefineHandler(val: T[], ctx: z.RefinementCtx) {
        if (val?.length <= 0) {
            return
        }

        const duplicates = findDuplicates(val)

        if (duplicates.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: messagePrefix
                    ? `${messagePrefix}: must be unique. Duplicates found for: ${duplicates.join(', ')}`
                    : `Must be unique. Duplicates found for: ${duplicates.join(', ')}`,
            })
        }
    }
}
