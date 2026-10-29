# joyamazaki.com：現在の検索運用方針

2026-10-29更新。利用者の最新指示を優先する。

## 現在の設定
- 名前検索の入口は https://joyamazaki.com/ 。トップは200応答と自己canonicalを維持。
- サイト名、HTML title、og:title、twitter:titleはjoyamazaki。PersonのJo Yamazakiと日本語別表記は維持し、ロゴの代替テキストにも人名を明記する。
- トップはindex, follow, nosnippet, max-image-preview:large。古い経歴を含む文章スニペットを抑制するためnosnippetを指定し、トップの説明文metaとCollectionPage.descriptionを削除。作品画像の設定を維持する。Google側の再クロール前には旧表示が残り得る。
- about・contactは最新指示によりindex, follow, max-image-preview:largeを維持。サイトマップにはトップ・about・contactと4作品の計7URLを掲載する。
- 旧jp HTMLを編集元とdistから削除し、旧URLは404とする。転送は行わない。Googleの更新までは旧検索結果から404に到達する場合がある。旧URLはrobots.txtで遮断せず、クローラーが404を確認できるようにする。
- 4作品の自己canonical・画像・PDF・本文・画質は維持する。全ての編集元HTMLとdistミラーを同期する。
- 毎週木曜の自動確認は利用者の指示により解除済み。

## Search Consoleで残る確認
1. トップとabout・contactをURL検査し、公開URLテストで最新のrobots設定を確認する。トップと変更対象を一度再クロール申請する。
2. Google選択canonical、最終クロール、旧jp URLの404確認・検索結果からの除外状況を確認する。ARCHXがHWKへ重複判定されていた問題の解消は公開HTMLだけでは確認できない。
3. 山﨑丈・山崎丈・Jo Yamazaki・joyamazakiの表示回数と表示ページを確認する。公開検索の不検出だけでインデックス未登録とは断定しない。
4. about・contactの一時削除申請が残っていれば、検索表示を許可する最新方針に合わせてキャンセルする。トップを含む広いプレフィックスの削除申請も範囲を確認する。
5. 修正と検索結果への反映は別であり、順位、Googleのタイトル、画像枚数、更新日数は保証しない。この作業ではSearch Consoleの認証済み情報へアクセスしておらず、再クロール申請も未実施。

## 検証
- HTML解析、構造化データJSON、全正規ページのcanonical、robots、サイトマップ7URL、旧jp HTMLの削除、残存内部リンク、dist同期、JavaScript構文、git diff --checkを確認する。
- 公開後にHTTP応答と配信HTMLを確認する。Googleの検索結果更新とSearch Consoleの私有データは別途確認が必要。

## 公式資料
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

## 2026-10-27：作品ページの重複対策

- ARCHX、PERCENTZ、HWK、BELULUに全26ページの静的imgを追加。幅4096pxのWebPを可逆圧縮で生成し、初期HTML・JavaScript無効時・PDF読込失敗時にも作品を表示する。
- 既存PDF.jsは同じページ要素に重ねて描画する。元PDF、ページ順、DPR上限3、描画幅上限4096px、従来の余白を維持する。
- 各作品の見出しとCreativeWork構造化データを作品固有にする。各画像の代替テキストは実際のPDFページ内テキストから生成する。HTMLのtitleと既存説明文は維持する。
- 正規URLは各作品自身のURLのまま。旧jp転送、About/Contactの検索対象設定も維持する。
- 再生成：`python scripts/build-work-previews.py`（PyMuPDF、Pillowが必要）。元PDFを更新した際は画像も再生成する。
- 検証：全26画像の画素が生成時のPDFラスタライズ結果と完全一致。元PDFがHEADと同一、ページ数・ID・canonical・構造化データ・distミラー・JavaScript構文・git diff --checkを確認。denoは環境にないためnode --checkで構文確認。ブラウザはローカルサーバーへ到達できず、ローカルChromiumの取得にも失敗したため実画面のPC/モバイル動作確認は未完了。
- 公開反映後の確認手順：ARCHX/PERCENTZ/HWK/BELULUをURL検査し、公開URLテストの取得HTMLと表示を確認して登録を一度リクエストする。Google選択canonicalの再判定は保証しない。Search Consoleでの再申請は未実施。

### 公開後の確認結果

- 公開コミット：3b92ec818ad2888baa7260056f3af8d9b9fc1df8。4作品の公開HTMLで合計26ページの画像と各作品自身のcanonicalを確認。
- 全26画像を公開URLから取得し、検証済みの可逆圧縮画像とバイト単位で一致。portfolio.js・styles.cssも公開版と一致。
- 公開サイトのARCHXとPERCENTZで既存PDF.js描画が正常に動作することを確認。HWK・BELULUの作品名、ページ数、canonicalもブラウザで確認。モバイルの実画面確認は未実施。
- Search Consoleへの再クロール申請とGoogle選択canonicalの再判定確認は未実施（ログインが必要）。
