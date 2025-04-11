import PIChamberGPIO from './src/PIChamberGPIO.ts'
import { readConfig } from '../utils/readConfig.ts'

const configPath: string = process.env.CONFIG ?? ''

const piGpio = new PIChamberGPIO(readConfig(configPath))

piGpio.start()

process.on('SIGINT', async () => {
    await piGpio.stop()
    process.exit()
})