export default {
    apps: [
        {
            name: "pi-chamber-gpio",
            script: "/home/pi/pi-chamber/pi-chamber-gpio/scripts/start.sh",
            env: {
                "NODE_ENV": "development",
                "CONFIG": "/home/pi/pi-chamber/config/config.example.cfg"
            }
        },
        // {
        //     name: "pi-chamber-server",
        //     script: "./pi-chamber-server/index.js",
        //     instances: 1,
        //     env: {
        //         "NODE_ENV": "development",
        //         "CONFIG": "/home/pi/pi-chamber/config/config.example.cfg"
        //     }
        // }
    ]
}