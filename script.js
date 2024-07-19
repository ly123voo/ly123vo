document.addEventListener('DOMContentLoaded', function () {
    let requestInterval = null;
    let requestTokens = 1;
    let requests = [];
    const formContainer = document.getElementById('form-container');
    const addTokenButton = document.getElementById('add-token');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const resultDiv = document.getElementById('result');

    addTokenButton.addEventListener('click', function () {
        requestTokens++;
        const tokenInputDiv = document.createElement('div');
        tokenInputDiv.className = 'token-input';
        tokenInputDiv.innerHTML = `<label for="token${requestTokens}">Token ${requestTokens}:</label><input type="text" id="token${requestTokens}" name="token">`;
        formContainer.appendChild(tokenInputDiv);
    });

    startButton.addEventListener('click', function () {
        const interval = parseInt(document.getElementById('interval').value);
        const concurrency = parseInt(document.getElementById('concurrency').value);
        const tokens = Array.from(document.querySelectorAll('input[name="token"]')).map(input => input.value);

        stopRequests();
        resultDiv.textContent = '请求中...';
        requestInterval = setInterval(() => {
            for (let i = 0; i < concurrency; i++) {
                const token = tokens[Math.floor(Math.random() * tokens.length)];
                makeRequest(token);
            }
        }, interval);
    });

    stopButton.addEventListener('click', stopRequests);

    function stopRequests() {
        if (requestInterval) {
            clearInterval(requestInterval);
            requestInterval = null;
        }
    }

    async function makeRequest(token) {
        const url = 'https://coupon.wuhunews.cn/SmallShopMerchant/FrontEnd/Home/receiveConsumerCoupon';
        const data = `couponId=1634&activityId=938&sourceChannel=djms&phoneNum=18237007977&lon=118.432999&lat=31.352201&channelId=1032&token=${token}`;
        const headers = {
            "Host": "coupon.wuhunews.cn",
            "Connection": "keep-alive",
            "Content-Length": "331",
            "sec-ch-ua": `"Android WebView";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": `"Android"`,
            "Origin": "https://djfood-admin.wuhunews.cn",
            "X-Requested-With": "com.borui.sbwh",
            "Referer": "https://djfood-admin.wuhunews.cn/",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: data
            });
            const result = await response.json();
            displayResult(result);
        } catch (error) {
            displayResult({ error: error.message });
        }
    }

    function displayResult(result) {
        resultDiv.textContent += JSON.stringify(result, null, 2) + '\n';
    }
});