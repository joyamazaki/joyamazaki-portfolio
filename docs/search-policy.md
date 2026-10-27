# joyamazaki.com：現在の検索運用方針

2026-10-26更新。利用者の最新指示を優先する。

## 検索結果の希望
- サイト名：joyamazaki。WebSite構造化データとog:site_nameで指定する。
- Safariなどのタブ名を戻す最新指示により、HTMLのtitleはjoyamazaki。og:title、twitter:title、ページ構造化データはJo Yamazakiを維持する。Google検索タイトルにもHTMLのtitleが使われるため、検索だけ別名になる保証はない。
- 説明文：Designer 2023 - Musashino Art University Department of Industrial, Interior and Craft Design
- 以前の文章スニペット非表示方針を撤回し、nosnippetを解除する。
- 検索タイトル、説明文、サイト名、画像表示と順位の最終判断はGoogleに委ねられる。即時反映や指定どおりの表示を保証しない。

## 検索対象
- トップ、about、contact、4作品はすべてindex, follow, max-image-preview:large。
- sitemap.xmlは上記7正規URLとトップの4作品画像を掲載する。
- 旧jpページは英語正規URLへ0秒転送し、canonicalを維持する。noindexを併用しない。
- Personの氏名と日本語別表記は維持する。サイトは英語のみ。本文・ロゴ・アニメーションは今回変更しない。
- 編集元とdistを同期する。

## Search Consoleで本人が行うこと
1. aboutとcontactの一時非表示申請をキャンセルする。旧jp URLや広いプレフィックスの申請も対象範囲を確認する。
2. 公開後、トップ・about・contactをURL検査し、公開URLをテストしてインデックス登録を一度リクエストする。繰り返し申請してもクロールは速くならない。
3. sitemap.xmlの正常処理を確認する。成功していれば連続再送信しない。
4. 最終クロール日時、Googleが選んだ正規URL、名前4表記の表示回数・表示ページを週単位で観察する。
5. 取得HTMLと検索結果の反映は別々に確認する。Search Consoleの私有データはこのチャットから直接確認できない。

## 公式資料
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

## 2026-10-27：作品ページの重複対策

- ARCHX、PERCENTZ、HWK、BELULUに全26ページの静的imgを追加。幅4096pxのWebPを可逆圧縮で生成し、初期HTML・JavaScript無効時・PDF読込失敗時にも作品を表示する。
- 既存PDF.jsは同じページ要素に重ねて描画する。元PDF、ページ順、DPR上限3、描画幅上限4096px、従来の余白を維持する。
- 各作品の見出しとCreativeWork構造化データを作品固有にする。各画像の代替テキストは実際のPDFページ内テキストから生成する。HTMLのtitleと既存説明文は維持する。
- 正規URLは各作品自身のURLのまま。旧jp転送、About/Contactの検索対象設定も維持する。
- 再生成：`python scripts/build-work-previews.py`（PyMuPDF、Pillowが必要）。元PDFを更新した際は画像も再生成する。
- 検証：全26画像の画素が生成時のPDFラスタライズ結果と完全一致。元PDFがHEADと同一、ページ数・ID・canonical・構造化データ・distミラー・JavaScript構文・git diff --checkを確認。denoは環境にないためnode --checkで構文確認。ブラウザはローカルサーバーへ到達できず、ローカルChromiumの取得にも失敗したため実画面のPC/モバイル動作確認は未完了。
- 公開反映後の確認手順：ARCHX/PERCENTZ/HWK/BELULUをURL検査し、公開URLテストの取得HTMLと表示を確認して登録を一度リクエストする。Google選択canonicalの再判定は保証しない。Search Consoleでの再申請は未実施。
