import PIChamberServer from './src/PIChamberServer.ts'
import { readConfig } from '../config-reader/readConfig.ts'

const configPath: string = process.env.CONFIG ?? ''
const config = readConfig(configPath)
const piChamberServer = new PIChamberServer(config)

piChamberServer.start()

process.on('SIGINT', async () => {
    await piChamberServer.stop()
    process.exit(0)
})
