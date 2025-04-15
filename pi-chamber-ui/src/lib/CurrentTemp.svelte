<script lang="ts">
    // Устанавливаем WebSocket соединение
    const socket = new WebSocket(`ws://${window.location.host}/ws`)

    let data: string = $state('')

    // Обработка входящих сообщений
    socket.addEventListener('message', event => {
        data = JSON.parse(event.data)
    })

    // Обработка ошибок
    socket.addEventListener('error', error => {
        console.error('WebSocket error:', error)
    })

    socket.addEventListener('close', () => {
        console.log('WebSocket connection closed')
    })
</script>

<div>
    {JSON.stringify(data)}
</div>
