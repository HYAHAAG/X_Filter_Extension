const LIKE_THRESHOLD = 50; // いいね数の閾値
const CHECK_INTERVAL = 10000; // 10秒ごとにフィルタリング
const processedTweets = new Set(); // 処理済みツイートを記録

function filterComments() {
    console.log("フィルタリング開始...");

    document.querySelectorAll("article").forEach((tweet, index) => {
        if (processedTweets.has(tweet)) return; // 既に処理済みならスキップ

        // ✅ いいね数を取得（r-bcqeeo がある <span>）
        let likeSpan = tweet.querySelector('span.r-bcqeeo');
        if (!likeSpan) {
            console.warn(`ツイート #${index + 1}: いいね数の要素が見つからないためスキップ`);
            return;
        }

        // ✅ いいね数を数値として取得
        let likeCount = parseInt(likeSpan.innerText.replace(/[^0-9]/g, '')) || 0;
        console.log(`ツイート #${index + 1}: いいね数 = ${likeCount}`);

        // ✅ いいね数が閾値以下なら非表示
        if (likeCount < LIKE_THRESHOLD) {
            console.log(`ツイート #${index + 1} を非表示`);
            tweet.style.display = "none";
        }

        processedTweets.add(tweet); // 処理済みリストに追加
    });

    console.log("フィルタリング終了");
}

// MutationObserverで動的に追加されたツイートを監視
const observer = new MutationObserver(() => filterComments());
observer.observe(document.body, { childList: true, subtree: true });

// 一定間隔でフィルタリングを実行（負荷軽減）
setInterval(filterComments, CHECK_INTERVAL);
