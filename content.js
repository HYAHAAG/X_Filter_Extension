const LIKE_THRESHOLD = 10; // いいね数の閾値
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

        // ✅ いいね数が閾値未満なら「透過＆高さを小さく」する
        if (likeCount < LIKE_THRESHOLD) {
            console.log(`ツイート #${index + 1} を縮小＆透過`);
            tweet.style.opacity = "0.2";  // 透明度を下げる
            tweet.style.maxHeight = "50px"; // 高さを小さく
            tweet.style.overflow = "hidden"; // スクロールを防ぐ
        }

        processedTweets.add(tweet); // 処理済みリストに追加
    });

    console.log("フィルタリング終了");
}

// ✅ MutationObserver でリアルタイム監視（setIntervalは削除）
const observer = new MutationObserver(() => filterComments());
observer.observe(document.body, { childList: true, subtree: true });
