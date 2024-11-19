// 設定、定数の定義
const GAME_CONFIG = {
  // 記号
  SYMBOLS: {
    CIRCLE: "⚫︎",
    CROSS: "✕",
  },
  // 勝利パターン
  WIN_PATTERNS: [
    // 横
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    // 縦
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    // 斜め
    [1, 5, 9],
    [3, 5, 7],
  ],
  // ターン数とゲーム終了フラグの初期値
  GAME_STATE: {
    INITIAL: {
      turn: 1,
      isGameOver: false,
    },
  },
};

// ゲームの状態を管理するオブジェクト
let currentGameState = { ...GAME_CONFIG.GAME_STATE.INITIAL };

// ユーティリティ関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

// IDを取得する関数
function getId(any) {
  return document.getElementById(any);
}
// ターンを判別する関数
function isCircle() {
  // ターン数が奇数ならtrue、偶数ならfalse
  return currentGameState.turn % 2 === 1;
}
// ゲームの状態を初期化する関数
function initializeGameState() {
  currentGameState = { ...GAME_CONFIG.GAME_STATE.INITIAL };
}
// 勝利判定の関数
function checkResult() {
  // 各勝利パターンをチェック
  for (let pattern of GAME_CONFIG.WIN_PATTERNS) {
    // 勝利パターンの3つのマス目を取得
    const [a, b, c] = pattern;
    // 3つのマス目の記号を取得
    const valueA = getId(`s${a}`).value;
    const valueB = getId(`s${b}`).value;
    const valueC = getId(`s${c}`).value;
    // 3つのマスが同じ記号で埋まっているかチェック
    if (valueA !== "" && valueA === valueB && valueB === valueC) {
      // ゲーム終了フラグをtrueにする
      currentGameState.isGameOver = true;
      // 勝利メッセージを表示
      getId("tool_resultText").innerHTML = valueA + "の勝利！";
      // ターン表示を空白にする
      resetNowPlayer();
      // マス目のクリック操作を無効化
      disableAllSquares();
      return;
    }
  }
  // 引き分けチェック
  if (currentGameState.turn === 9) {
    // ゲーム終了フラグをtrueにする
    currentGameState.isGameOver = true;
    // 引き分けメッセージを表示
    getId("tool_resultText").innerHTML = "引き分け！";
    // ターン表示を空白にする
    resetNowPlayer();
    // マス目のクリック操作を無効化
    disableAllSquares();
    return;
  }
}

// UI操作関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

// 現在のターンのプレイヤーを表示する関数
function changeNowPlayer() {
  // ターン数が奇数なら⚫︎、偶数なら✕
  if (isCircle()) {
    getId("tool_nowPlayer").innerHTML = GAME_CONFIG.SYMBOLS.CIRCLE + "のターン";
  } else {
    getId("tool_nowPlayer").innerHTML = GAME_CONFIG.SYMBOLS.CROSS + "のターン";
  }
}
// ターン表示を空白にする関数
function resetNowPlayer() {
  getId("tool_nowPlayer").innerHTML = "";
}
// クリック操作の無効化の関数
function disableAllSquares() {
  for (let i = 1; i <= 9; i++) {
    getId(`s${i}`).onclick = null;
  }
}
// クリック操作の有効化の関数
function enableAllSquares() {
  for (let i = 1; i <= 9; i++) {
    getId(`s${i}`).onclick = clickToCheck;
  }
}
// クリックしたマス目に⚫︎、✕を入力する関数
function clickToCheck(e) {
  // クリックしたマス目のIDを取得
  let id = e.target.id;
  // クリックしたマス目のDOMオブジェクトを取得
  let anyDomObject = getId(id);
  // すでにマークが付いているマス目をチェック
  if (anyDomObject.value !== "") {
    return;
  }
  // そのマス目（inputタグ）のvalue属性を変更する
  if (isCircle()) anyDomObject.value = GAME_CONFIG.SYMBOLS.CIRCLE;
  else anyDomObject.value = GAME_CONFIG.SYMBOLS.CROSS;
  // ターンを更新
  currentGameState.turn++;
  // ターン表示を切り替える
  changeNowPlayer();
  // 勝利判定
  checkResult();
  console.log(currentGameState);
}
// リセットボタンをクリックした時の処理の関数
function resetAction() {
  // マス目の記号を初期値に戻す
  for (let i = 1; i <= 9; i++) {
    getId(`s${i}`).value = "";
  }
  // ゲームの状態を初期化
  initializeGameState();
  // ターン表示を初期値に戻す
  changeNowPlayer();
  // 勝利判定のテキストを初期値に戻す
  getId("tool_resultText").innerHTML = "";
  // クリック操作を有効化
  enableAllSquares();
}

// イベント処理関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

// イベントリスナーの設定
function setupEventListeners() {
  // リセットボタンをクリックした時の処理
  getId("reset").addEventListener("click", resetAction);
  // クリック操作を有効化
  enableAllSquares();
}
// ページが読み込まれた時の初期化の関数
function onloadAction() {
  // イベントリスナーの設定
  setupEventListeners();
  // ターン表示を初期値に戻す
  changeNowPlayer();
}

// ページが読み込まれた時、onloadActionを実行
window.addEventListener("load", onloadAction);
