# joyamazaki.com：現在の検索運用方針

## 入口と表示
- サイトは英語のみ。主な入口は https://joyamazaki.com/ 。
- 「山﨑丈」「山崎丈」「Jo Yamazaki」「joyamazaki」の人物情報・別表記をトップに維持する。タイトルの希望はjoyamazaki。
- トップの文章スニペットはnosnippetで抑制し、作品画像のプレビューは許可する。画像の表示有無・枚数、最終タイトル、順位はGoogleが決める。
- 検索除外を操作しても、順位や評価が別ページへ自動で移ることはない。

## 現在の検索対象
| URL | 設定 |
| --- | --- |
| / | index, follow, nosnippet, max-image-preview:large。正規URLはトップ自身 |
| /about/ | index, follow, nosnippet。検索からの入口を確保するため検索対象へ戻す |
| /contact/ | noindexを維持。サイト内では閲覧可能 |
| /works/ 以下の4作品 | 検索対象。PDF表示と作品へのリンクを維持 |
| /jp/ 以下 | 英語の正規URLへ0秒転送。検索対象の転送先への統一にはnoindexを併用しない。旧contactの検索除外は維持 |

サイトマップはトップ・about・4作品の計6URLと、トップの4作品画像。contactと転送元URLを掲載しない。robots.txtでクロールを遮断しない。

## 今回の方針変更
以前はabout/contactを検索除外していた。利用者はSearch Consoleでaboutの一時非表示を解除し、aboutも検索に戻す方針を選択したため、サイト側のaboutのnoindexも解除した。contactの扱いは変更しない。
本文は英語のまま、氏名・大学表記・顔写真なし・アニメーション・ロゴを維持する。編集元とdistを必ず同期する。

## Search Consoleで本人が行うこと
1. /about/ の一時非表示がキャンセルされていることを確認する。旧 /jp/about/ に申請していた場合も対象を確認する。contactの非表示申請は維持してよい。
2. https://joyamazaki.com/about/ をURL検査し、公開URLをテストして検索登録が許可されていることを確認する。今回の公開後に一度インデックス登録をリクエストする。
3. トップは登録済みでも名前検索の上位表示が保証されるわけではない。トップの最終クロール日時、Googleが選んだ正規URL、検索パフォーマンスを確認する。
4. https://joyamazaki.com/sitemap.xml を確認し、成功なら連続再送信しない。Googleの再読み込み後は正規ページ6件が掲載対象となる。検出数はすぐ一致するとは限らない。
5. 変更ごとに繰り返し申請せず、氏名4表記での表示回数と表示先ページを週単位で観察する。取得エラーや誤った一時非表示の範囲があれば先に解消する。

## 確認・説明の原則
コード、push、公開サイトへの反映、Googleでの登録・順位は別々に確認して報告する。Search Consoleの私有データはこのチャットから直接確認できない。
Googleの登録や順位を保証しない。実際に登録済みかはURL検査で確認する。画像だけの検索結果表示も保証しない。
氏名の別名情報だけで順位を約束しない。ロゴや本文に不自然なキーワードを詰め込まない。追加の可視署名などのデザイン変更は別途ユーザーと相談する。

## 公式資料
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://support.google.com/webmasters/answer/9012289
- https://support.google.com/webmasters/answer/9689846
