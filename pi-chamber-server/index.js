import * as net from 'net'
import express from 'express'
import { WebSocketServer } from 'ws'
import path from 'path'

const PORT = 3000;
const SOCKET_PATH = '/tmp/pi-chamb.sock';

const app = express();

app.use(express.static(path.join('/home/pi/pi-chamber/pi-chamber-ui/dist')));


// Запускаем HTTP сервер
const server = app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
});

// Создаем WebSocket сервер
const wss = new WebSocketServer({ server });

let currentTemp = [];

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');


    // Отправляем приветственное сообщение
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to WebSocket server',
        timestamp: Date.now()
    }));

    const intervalId = setInterval(() => {
        ws.send(JSON.stringify({
            type: 'temp',
            message: currentTemp,
            timestamp: Date.now()
        }));
    }, 1000)


    // Обработка закрытия соединения
    ws.on('close', () => {
        clearInterval(intervalId)
        console.log('WebSocket connection closed');
    });
});


const client = net.createConnection(SOCKET_PATH, () => {
    console.log('Подключено к серверу');

    // Отправляем сообщение
    // Чтение температуры каждую секунду
    setInterval(() => {
        client.write('Привет, сервер!');
    }, 1000)

});

client.on('data', (data) => {
    const str = data.toString()
    console.log(`Получен ответ: ${str}`);
    currentTemp = JSON.parse(str)
});

client.on('end', () => {
    console.log('Отключено от сервера');
});

client.on('error', (err) => {
    console.error('Ошибка клиента:', err);
});

