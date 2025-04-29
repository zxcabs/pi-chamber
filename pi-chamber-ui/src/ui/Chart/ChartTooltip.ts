import type { ICharDataItem } from './Char'

const formatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
})

const dateFormat = (date: number | string) => formatter.format(new Date(date))

const item = (item: ICharDataItem) => `<p>${item.group}: ${Number(item.value).toFixed(2)}</p>`

export default (data: ICharDataItem[]) => `
<div class="bx--cc--tooltip">
    <p>Time: ${dateFormat(data[0].date)}</p>
    ${data.map(item).join('')}
</div>
`
