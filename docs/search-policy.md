# joyamazaki.com：検索表示の確認結果と運用方針

## 目標と、設定で制御できる範囲

「山﨑丈」「山崎丈」「Jo Yamazaki」「joyamazaki」で検索したときの入口を、workトップの https://joyamazaki.com/ に統一する。希望する見え方は、タイトルが joyamazaki、文章の説明はなし、作品画像のプレビューあり。

- サイト側で指定すること：タイトル、正式なトップURL、氏名と別表記、文章スニペットの抑制、画像プレビューの許可、about/contactの検索除外。
- Googleが決めること：登録するか、検索語ごとの順位、最終的なタイトル、作品画像を表示するか・何枚並べるか。1位や画像だけのレイアウトをコードから確約する設定はない。
- `nosnippet` は文章のスニペットを抑制する指定。静止画サムネイルは表示される場合がある。`max-image-preview:large` は大きな画像の許可であり、画像表示の命令ではない。
- `ImageObject` や `ItemList` の追加だけで、Googleの画像カルーセルへの掲載が保証されるわけではない。

## 公開サーバーで確認できたこと

GitHub上のコードだけでなく、公開URLへHTTPSで直接アクセスして確認した。

| 対象 | 確認結果 |
| --- | --- |
| `https://joyamazaki.com/` | HTTP 200。GitHubの最新トップと内容が一致。noindexや検索を遮断するX-Robots-Tagはなし |
| トップのrobots設定 | `index, follow, nosnippet, max-image-preview:large` |
| トップのタイトル・見出し・サイト名 | `joyamazaki` に統一 |
| 正規URL | トップ自身のcanonicalは `https://joyamazaki.com/` |
| 氏名情報 | PersonのnameはJo Yamazaki。alternateNameに山﨑丈・山崎丈・スペースあり表記・joyamazaki・jo yamazakiがある |
| 作品画像 | 4枚ともHTTP 200。WebP、1600×2000。通常のHTMLのimg要素で存在し、構造化データ・OGP・画像サイトマップでも参照されている |
| HTTP・www付きURL | HTTPS・wwwなしトップへ転送される |
| `/index.html` | HTTP 200、canonicalはトップ。サイト内の入口には使わない |
| `/about/`・`/contact/` | HTTP 200で閲覧可能、`noindex, follow, nosnippet`。ナビゲーションから開ける |
| `/about` | 末尾スラッシュ付きの `/about/` へHTTPで転送される |
| 旧 `/jp/` 配下 | 対応する正規URLへの0秒meta refreshとcanonicalがある。別の日本語サイトとして増やさない |
| `robots.txt` | クロールを許可し、サイトマップを案内。noindexを読めるようabout/contactもブロックしない |
| サイトマップ | HTTP 200。トップ＋4作品ページのみ。トップに4画像を記載。about/contact・旧日本語URLは含まれない |
| 公開用ミラー `dist/` | 直下の最新版に対して、14個のHTMLとサイトマップに旧設定が残っていた。今回、直下と一致するよう同期する。`.DS_Store` は対象外 |

通常の検索ツールの結果は、利用者のGoogle画面と同じとは限らない。Googleの最終クロール日時・選択した正規URL・登録状態・非表示申請の対象は、Search Consoleの権限が必要なためこのチャットからは確認していない。

## 今回の整理

検索対象として残すページへ転送する旧日本語URL（`/jp/` と `/jp/works/…/`）では、転送・canonicalによる統一とnoindexを併用しない。0秒転送とcanonicalを維持し、noindexだけを外して、正規URLへの統一を明確にする。

about/contact、およびそれらへ転送する旧日本語URLのnoindexは維持する。トップの見た目・4作品の順番・PDF・本文のアニメーションは変更しない。

`dist/` に残っていた旧日本語ページ・古いサイトマップ等も、現在の編集元に揃える。GitHub Pagesの直下公開と、将来ミラーから公開する場合で検索方針が変わらないようにする。

この整理はGoogleへの情報を一貫させるためのもの。これが現在の未掲載の原因だった、または修正で必ず順位が上がる、とは断定しない。

## aboutが消えたのにトップが出ない理由

about/contactは検索除外と非表示申請の対象なので、検索結果から消えること自体は意図した結果。aboutの順位や評価がトップへ自動で移されるわけではない。

トップが見つからない原因は、Search Consoleを確認するまで確定できない。確認対象は、トップの未登録、古いクロール結果、Googleが選んだ別の正規URL、トップまで対象にした非表示申請、単純な順位の変動など。

別表記をPersonの構造化データに入れることは氏名の理解を助ける情報であり、「山崎丈」での登録・順位の保証ではない。

## ご本人がSearch Consoleで行うこと

### 1. 非表示申請の対象を確認する

プロパティは `joyamazaki.com` を選ぶ。「インデックス作成」→「非表示」→「一時的な非表示」で、申請URLと範囲を確認する。

- `/about/`、`/contact/`、それぞれの旧 `/jp/` URLだけを対象にした申請なら、希望に沿っている。検索から消えても、サイト内でページを開くことはできる。
- `https://joyamazaki.com/` 自体の非表示申請があればキャンセルする。トップURLに対して「このプレフィックスで始まるすべてのURL」を選んでいると、サイト全体を隠してしまう。
- about/contactが消えたからといって追加のURLを次々に非表示申請しない。URLの統一や順位の引き継ぎに非表示ツールを使わない。

### 2. トップをURL検査する

入力するURLは `https://joyamazaki.com/`。

まず保存されているGoogleの登録情報を確認し、次を記録する。

1. 全体の判定：「URLはGoogleに登録されています」か、未登録か。
2. 「ページのインデックス登録」にある未登録の理由。
3. 最終クロール日時。
4. ユーザーが指定した正規URLと、Googleが選択した正規URL。

Googleが選んだ正規URLもトップになることを目指す。公開URLテストだけでは、Googleが選ぶ正規URLやSearch Consoleの一時非表示までは判定できない。

次に「公開URLをテスト」で、現在の取得・インデックス許可・レンダリング後のページを確認する。可能なら「テスト済みページを表示」で作品画像が見えるか確認する。

- トップをすでに登録リクエスト済みで問題がなければ、毎日繰り返す必要はない。
- 未登録で、修正後の公開テストが成功した場合に、一度リクエストする。
- 「クロール済み・インデックス未登録」「検出・インデックス未登録」「重複」などは原因に応じて対応する。表示された理由と正規URLをこのチャットに共有すれば、次の対応を絞れる。
- 「URLはGoogleに登録されています」でも、特定の検索語で上位に出る保証はない。

### 3. 申請済みの3URLの扱い

| 申請済みURL | 今後の扱い |
| --- | --- |
| `https://joyamazaki.com/` | 検索入口。登録情報を確認する |
| `https://joyamazaki.com/contact/` | 検索除外のため、今後はインデックス登録を申請しない |
| `https://joyamazaki.com/about` | `/about/` へ転送される検索除外ページ。今後はインデックス登録を申請しない |

過去のインデックス登録リクエストを取り消す操作は不要。about/contactの公開テストでnoindexが検出されるのは、今回の方針では正常。

### 4. サイトマップを確認する

「サイトマップ」で `https://joyamazaki.com/sitemap.xml` が「成功」か確認する。すでに送信済みで成功なら、同じURLを何度も送信しなくてよい。

読み取り可能なページはトップと4作品の計5ページ。画像はトップに4枚を記載。サイトマップはページ発見の手助けであり、登録や順位を保証しない。about/contactがnoindexであることも変わらない。

### 5. 検索パフォーマンスを確認する

「検索パフォーマンス」で検索タイプをウェブにし、ページを `https://joyamazaki.com/` に絞る。「山﨑丈」「山崎丈」「Jo Yamazaki」「joyamazaki」を個別に見て、表示回数・クリック・平均掲載順位を記録する。

画像の発見状況は検索タイプ「画像」でも確認する。ただし画像検索の実績と、通常検索に複数の画像が並ぶ表示は別のもの。

手元の検索順位だけで判断せず、週ごとのデータを比較する。最初の1〜2週間を観察の区切りにするが、Googleの処理期限を保証するものではない。取得エラー・誤った非表示範囲・正規URLの誤りが見つかった場合は待たずに修正する。

## これからの運用方針

1. 名前検索の入口は `https://joyamazaki.com/` に固定する。プロフィール・SNSなどの公開リンクもこのURLに統一する。こちらから外部アカウントを無断編集しない。
2. トップのtitle、og:title、WebSiteのname、主見出しは joyamazaki を維持する。
3. Personの氏名・別表記を一貫させる。名前の登録だけで検索結果が保証されるとは説明しない。
4. 文章なしの希望が続く間はnosnippetを維持し、画像プレビューは許可する。画像を隠すnoimageindexは付けない。
5. about/contactのnoindexを維持する。検索の入口を変えたいだけの理由で、異なる内容のaboutをトップの重複ページとしてcanonical指定しない。
6. 作品ページは画像・作品情報の発見経路として検索対象に残す。氏名検索ではトップを入口にする方針を保ち、無断で作品ページまで全て検索除外しない。
7. 作品画像は通常のimg要素・分かりやすいalt・固定URL・正しい画像サイズで提供する。サイトマップと構造化データの参照先が一致することを更新時に確認する。
8. 順位が変わらないからといって、日ごとにcanonicalやnoindexを反転させない。日付だけの更新や空コミットでクロール・順位を操作しようとしない。
9. トップが登録済みなのに氏名との関連が弱い状態が続く場合は、本人の公開プロフィールからの自然なリンクや、トップの見た目を損なわない本人紹介の置き方を相談する。隠しキーワードの詰め込みや、検索順位を上げるための不自然なリンク購入は行わない。
10. コードの変更・GitHubへのpush・GitHub Pagesの公開・Googleの登録/順位を別々に確認して報告する。公開成功を検索結果の更新成功と同一視しない。

## 更新時の確認項目

- トップと4作品・4画像・robots.txt・sitemap.xmlが正常に取得できる。
- トップにはnoindexがなく、canonicalがトップ自身である。
- title/og:title/WebSite nameがjoyamazakiで、4つの氏名表記が保持されている。
- about/contactにはnoindexがあり、robots.txtでクロールを止めていない。
- 旧URLの0秒転送とcanonicalが同じ正規URLを指す。
- サイトマップにnoindexページ・転送URLを入れない。
- 編集元とdistの対応ファイルが一致する。
- 公開後に実際の配信HTMLまで確認する。

## Google公式資料

- スニペットと画像プレビュー：https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- タイトルの決定：https://developers.google.com/search/docs/appearance/title-link
- 画像の認識：https://developers.google.com/search/docs/appearance/google-images
- 正規URL：https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- 転送：https://developers.google.com/search/docs/crawling-indexing/301-redirects
- URL検査：https://support.google.com/webmasters/answer/9012289
- 非表示申請：https://support.google.com/webmasters/answer/9689846
- 再クロール：https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
