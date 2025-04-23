import PIChamberGPIO from './src/PIChamberGPIO.ts'
import { readConfig } from '../config-reader/readConfig.ts'

const configPath: string = process.env.CONFIG ?? ''

const piGpio = new PIChamberGPIO(readConfig(configPath))

piGpio.start()

process.on('SIGINT', async () => {
    await piGpio.stop()
    process.exit(0)
})
