// 定期的に投稿とコメントをスキャンする
setInterval(() => {
    console.log("投稿とコメントをスキャンしています...");

    // 投稿とコメントの要素を取得
    const elements = document.querySelectorAll("article, div[data-testid='reply']"); // 投稿とコメントを対象に

    elements.forEach(element => {
        const followStats = element.querySelector("[data-testid='User-Stats']"); // ユーザー情報を特定
        if (!followStats) return; // 情報が見つからなければスキップ

        const text = followStats.innerText; // フォロワー・フォロー情報を取得
        const followersMatch = text.match(/フォロワー\s?(\d+)/);
        const followingMatch = text.match(/フォロー\s?(\d+)/);

        const followers = followersMatch ? parseInt(followersMatch[1]) : 0;
        const following = followingMatch ? parseInt(followingMatch[1]) : 0;

        // 条件: フォロワーがフォローの80%未満、またはフォロワーが3000人未満
        if (followers < following * 0.8 || followers < 3000) {
            console.log(`非表示対象: フォロワー数 ${followers}, フォロー数 ${following}`);
            element.style.display = "none"; // 非表示
        }
    });
}, 3000); // 3秒ごとに実行
