// 定期的に投稿をスキャンする
setInterval(() => {
    const posts = document.querySelectorAll("article"); // 投稿を探す
    posts.forEach(post => {
        const followStats = post.querySelector("[data-testid='User-Stats']"); // フォロワー情報を探すセレクタ（要確認）
        if (!followStats) return; // 情報が見つからなければスキップ

        const text = followStats.innerText; // フォロワー・フォロー情報を取得
        const followersMatch = text.match(/フォロワー\s?(\d+)/);
        const followingMatch = text.match(/フォロー\s?(\d+)/);

        const followers = followersMatch ? parseInt(followersMatch[1]) : 0;
        const following = followingMatch ? parseInt(followingMatch[1]) : 0;

        // 条件: フォロワーがフォローの80%未満、またはフォロワーが3000人未満
        if (followers < following * 0.8 || followers < 3000) {
            post.style.display = "none"; // 投稿を非表示
        }
    });
}, 3000); // 3秒ごとに実行
