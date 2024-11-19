// ゲーム設定の定数をオブジェクトにまとめる
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
  // 追加：初期状態の設定
  GAME_STATE: {
    INITIAL: {
      turn: 1,
      isGameOver: false,
    },
  },
};

// ゲームの状態を管理するオブジェクト
let currentGameState = { ...GAME_CONFIG.GAME_STATE.INITIAL };

// IDを取得する関数
function getId(any) {
  return document.getElementById(any);
}

// ターンを判別する関数
function isCircle() {
  return currentGameState.turn % 2 === 1;
}

// 現在のターンのプレイヤーを表示する関数
function changeNowPlayer() {
  if (isCircle()) {
    getId("tool_nowPlayer").innerHTML = GAME_CONFIG.SYMBOLS.CIRCLE + "のターン";
  } else {
    getId("tool_nowPlayer").innerHTML = GAME_CONFIG.SYMBOLS.CROSS + "のターン";
  }
}

// 勝利判定の関数
function checkResult() {
  // ゲーム終了チェック
  if (currentGameState.isGameOver) return;
  // ターン表示を空白にする関数
  function resetNowPlayer() {
    getId("tool_nowPlayer").innerHTML = "";
  }
  // 各勝利パターンをチェック
  for (let pattern of GAME_CONFIG.WIN_PATTERNS) {
    const [a, b, c] = pattern;
    const valueA = getId(`s${a}`).value;
    const valueB = getId(`s${b}`).value;
    const valueC = getId(`s${c}`).value;
    // 3つのマスが同じ記号で埋まっているかチェック
    if (valueA !== "" && valueA === valueB && valueB === valueC) {
      currentGameState.isGameOver = true;
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
    currentGameState.isGameOver = true;
    getId("tool_resultText").innerHTML = "引き分け！";
    // ターン表示を空白にする
    resetNowPlayer();
    // マス目のクリック操作を無効化
    disableAllSquares();
    return;
  }
}

// 盤面の無効化の関数
function disableAllSquares() {
  for (let i = 1; i <= 9; i++) {
    getId(`s${i}`).onclick = null;
  }
}

// クリックしたマス目に記号を入力する関数
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
}

// クリック操作の有効化の関数
function enableAllSquares() {
  for (let i = 1; i <= 9; i++) {
    getId(`s${i}`).onclick = clickToCheck;
  }
}

// ゲームの状態を初期化する関数を追加
function initializeGameState() {
  currentGameState = { ...GAME_CONFIG.GAME_STATE.INITIAL };
}

// リセットボタンをクリックした時の処理の関数
function resetAction() {
  // マス目の記号を初期値に戻す
  for (let i = 1; i <= 9; i++) {
    getId(`s${i}`).value = "";
  }
  // ゲームの状態を初期化
  initializeGameState();
  changeNowPlayer();
  getId("tool_resultText").innerHTML = "";
  enableAllSquares();
}

// イベントリスナーの設定
function setupEventListeners() {
  getId("reset").addEventListener("click", resetAction);
  enableAllSquares();
}

// リロードした時の初期化の関数
function onloadAction() {
  setupEventListeners();
  changeNowPlayer();
}

window.addEventListener("load", onloadAction);
