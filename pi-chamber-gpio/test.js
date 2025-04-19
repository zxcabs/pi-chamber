import { pigpio } from 'pigpio-client'

const pig = pigpio({ host: 'localhost' })

const ready = new Promise((resolve, reject) => {
    pig.once('connected', resolve)
    pig.once('error', reject)
})

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

ready
    .then(async info => {
        // display information on pigpio and connection status
        console.log(JSON.stringify(info, null, 2))

        // control an LED on GPIO 4
        const led = pig.gpio(18)
        await led.modeSet('output')
        let brightness = 0
        let dir = +1
        const speed = 1

        const blink = async () => {
            var freq1 = 50;
            let val = 1E6 / 100 * brightness; 

            console.log('val:', val)
    
            await led.hardwarePWM(freq1, val);
           // await led.hardwarePWM(brightness)

            dir = brightness >= 100 ? -1 : brightness <= 0 ? +1 : dir

            brightness = brightness + speed * dir

            console.log('brightness', brightness)


            setTimeout(blink, 50)
        }

        blink()
    })
    .catch(console.error)

process.on('SIGINT', async () => {
    await pig.gpio(17).write(0)
    await pig.gpio(27).write(0)
    await pig.gpio(22).write(0)
    process.exit(0)
})
