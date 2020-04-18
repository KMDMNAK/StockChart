import { getStockData, getPullDown } from '../acquise/kabutan'

describe('', () => {
    it('pull down', async () => {
        const { code, name } = (await getPullDown('ヤマハ'))[0]
        expect(name).toBe('ヤマハ発動機')
        expect(code).toBe('7272')
    })
    it.skip('get stock data', async () => {
        const a = await getStockData('7272', 'day', 1)
        console.log(a)
    })
})