// ユーザー情報をキャッシュするためのオブジェクト
const userCache = {};

// 非表示条件を判定する関数
function shouldHideComment({ followers, following }) {
    return followers < following * 0.8 || followers < 3000;
}

// ユーザー情報を取得する関数
async function getUserInfo(username) {
    // キャッシュに情報がある場合はキャッシュを使用
    if (userCache[username]) {
        console.log(`[X Filter] キャッシュを使用: @${username}`);
        return userCache[username];
    }

    try {
        console.log(`[X Filter] プロフィールページにアクセス: https://x.com/${username}`);
        const response = await fetch(`https://x.com/${username}`);
        if (!response.ok) {
            console.error(`[X Filter] プロフィールページへのリクエスト失敗: @${username} (HTTPステータス: ${response.status})`);
            return null;
        }

        console.log(`[X Filter] プロフィールページへのリクエスト成功: @${username}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // フォロワー数を取得
        const followersLink = doc.querySelector("a[href$='/followers']");
        const followersElement = followersLink ? followersLink.querySelector("span > span") : null;
        const followers = followersElement
            ? parseInt(followersElement.textContent.replace(/,/g, ''))
            : 0;

        // フォロー数を取得
        const followingLink = doc.querySelector("a[href$='/following']");
        const followingElement = followingLink ? followingLink.querySelector("span > span") : null;
        const following = followingElement
            ? parseInt(followingElement.textContent.replace(/,/g, ''))
            : 0;

        // キャッシュに保存
        userCache[username] = { followers, following };
        console.log(`[X Filter] ユーザー情報取得成功: @${username}, フォロワー: ${followers}, フォロー: ${following}`);
        return { followers, following };
    } catch (error) {
        console.error(`[X Filter] プロフィールページへのアクセス中にエラー発生: @${username}`, error);
        return null;
    }
}

// コメントをスキャンし、非表示にする関数
async function scanComments() {
    console.log("[X Filter] コメントをスキャンしています...");

    const comments = document.querySelectorAll("div[data-testid='reply']");
    for (const comment of comments) {
        const usernameElement = comment.querySelector("a[href*='/']");
        if (!usernameElement) {
            console.warn("[X Filter] ユーザー名が取得できませんでした。");
            continue;
        }

        const username = usernameElement.getAttribute('href').split('/').pop();
        console.log(`[X Filter] ユーザー名を検出: @${username}`);

        const userInfo = await getUserInfo(username);
        if (userInfo) {
            if (shouldHideComment(userInfo)) {
                console.log(`[X Filter] 非表示条件に一致: @${username}`);
                comment.style.display = "none";
            } else {
                console.log(`[X Filter] 非表示条件に一致しない: @${username}`);
            }
        } else {
            console.error(`[X Filter] ユーザー情報を取得できなかったためスキップ: @${username}`);
        }
    }
}

// 定期的にコメントをスキャン
setInterval(scanComments, 10000); // 10秒ごとに実行
