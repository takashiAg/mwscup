# mwscup

## Description

近年，Web ブラウザ上で仮想通貨を採掘するツール (マイニングツール) が確認され，話題となりました．
こうしたマイニングツールは Web ページの閲覧者が気づかないうちに実行されています．

マイニングスクリプトが埋め込まれた Web ページにアクセスすると、閲覧者は Web ブラウザ経由で PC の計算資源を奪われます。
会社運営業務の妨げになるようなことも考えられるでしょう。  

本アプリケーションの目的は，計算資源を奪う Web サイトを検出することです。
危険性を利用者に通知することで、計算資源の盗難を防ぐことに繋がります。


グラフによる可視化で、どの Web サイトがどれだけのリソースを消費しているのか簡単に確認できます。

## Demo
- Google にアクセスした時
  - 特に異常なし
  
![グーグルにアクセスした時](image/グーグルにアクセスした時.png)　　
　　
  
- とても重いサイトにアクセスした時
  - CPU 使用率上昇の警告が表示
  
![とても重いサイトにアクセスした時](image/とても重いサイトにアクセスした時.png)

## Requirement
``node.js`` および管理パッケージ ``npm`` が必要です。  

OS は UNIX システムおよび Mac OS にのみ対応しています。
動作確認済みの端末は下記の通りです。
- **Mac OS X 10.13.5**
- **Ubuntu 14.04**
- **Ubuntu 16.04**

※ Ubuntu の ``apt`` でインストールするとコマンド名が ``nodejs`` となります。
シンボリックなどを使用して ``node`` にしてください。


## Install & Usage
```
$ git clone https://github.com/takashiAg/mwscup
$ cd mwscup
$ npm install
$ npm start
```
起動時は下記コマンドのみで構いません。
```
$ npm start
```

## References
- https://qiita.com/Quramy/items/a4be32769366cfe55778
- https://qiita.com/mamosan/items/084039c3e6d703b7b45f
- https://stackoverflow.com/questions/31759367/using-console-log-in-electron-app