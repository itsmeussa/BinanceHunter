require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Binance = require('node-binance-api');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/scan', async (req, res) => {
    const { apiKey, apiSecret } = req.body;
    
    try {
        const binance = new Binance().options({
            APIKEY: apiKey,
            APISECRET: apiSecret,
            family: 4
        });

        const [balances, prices] = await Promise.all([
            binance.balance(),
            binance.prices()
        ]);

        let totalUSD = 0;
        const assets = [];

        for (const [asset, info] of Object.entries(balances)) {
            const amount = parseFloat(info.available) + parseFloat(info.onOrder);
            if (amount <= 0) continue;

            let price = 1;
            if (asset !== 'USDT') {
                const pair = `${asset}USDT`;
                price = parseFloat(prices[pair]) || 0;
            }
            
            const value = amount * price;
            if (value > 0.01) { // Filter real values
                totalUSD += value;
                assets.push({
                    asset,
                    amount: amount.toFixed(8),
                    value: value.toFixed(2)
                });
            }
        }

        res.json({
            success: true,
            totalUSD: totalUSD.toFixed(2),
            assets
        });

    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({
            success: false,
            error: 'Invalid API keys or network error'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});