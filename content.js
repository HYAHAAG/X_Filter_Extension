const LIKE_THRESHOLD = 30; // いいねの閾値（例: 10以下は非表示）
const CHECK_INTERVAL = 5000; // 5秒ごとにチェック

function filterComments() {
    document.querySelectorAll("article").forEach(tweet => {
        let likeElement = tweet.querySelector('div[data-testid="like"]'); // いいねの要素
        let likeCount = likeElement ? parseInt(likeElement.innerText.replace(/[^0-9]/g, '')) || 0 : 0;

        // いいね数が閾値未満なら非表示
        if (likeCount < LIKE_THRESHOLD) {
            tweet.style.display = "none";
        }
    });
}

// ページの更新やスクロール時にも適用
const observer = new MutationObserver(() => filterComments());
observer.observe(document.body, { childList: true, subtree: true });

// 定期的にフィルタリングを適用
setInterval(filterComments, CHECK_INTERVAL);
