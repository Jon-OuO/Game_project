// 獲取 Canvas 上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 設置畫布大小為全視窗
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 載入背景圖片和角色精靈圖
const bgImage = new Image();
bgImage.src = 'test_game_screen/background_0.png'; // 將此處設為您的背景圖片路徑

const spriteRightWalk = new Image();
spriteRightWalk.src = 'test_game_screen/human_walk_right.png';

const spriteLeftWalk = new Image();
spriteLeftWalk.src = 'test_game_screen/human_walk_left.png';

const attackRight = new Image();
attackRight.src = 'test_game_screen/human_attack_right.png';

const attackLeft = new Image();
attackLeft.src = 'test_game_screen/human_attack_left.png';

// 設定角色屬性
const player = {
  x: 100,
  y: canvas.height - 150,
  width: 128,
  height: 128, // 統一為128px高度，避免不同高度導致的不一致
  speed: 3,
  dx: 0,
  dy: 0,
  gravity: 0.8,
  isJumping: false,
  onGround: false,
  direction: 'right', // 追蹤角色方向
  frameIndex: 0,
  frameCounter: 0,
  totalFrames: 9,
  attackFrames: 6, // 攻擊動畫幀數
  animationSpeed: 10,
  standing: true,
  isAttacking: false, // 是否正在攻擊
  frameWidth: 64, // 單個框架的寬度
};

// 繪製背景
function drawBackground() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// 繪製角色
function drawPlayer() {
  if (player.isAttacking) {
    // 根據方向選擇攻擊精靈圖
    const sprite = player.direction === 'right' ? attackRight : attackLeft;
    const spriteX = player.frameIndex * 64; // 攻擊動畫幀寬度64px
    ctx.drawImage(
      sprite,
      spriteX, 0, 64, 64, // 原始精靈圖切割寬度和高度
      player.x, player.y, player.width, player.height // 繪製到畫布上的大小
    );
  } else {
    // 根據方向選擇站立或行走精靈圖
    const sprite = player.direction === 'right' ? spriteRightWalk : spriteLeftWalk;
    const spriteX = player.standing ? 0 : player.frameIndex * player.frameWidth; // 站立時為第一幀
    ctx.drawImage(
      sprite,
      spriteX, 0, player.frameWidth, sprite.height, // 原始精靈圖高度
      player.x, player.y, player.width, player.height // 統一為顯示高度128px
    );
  }
}

// 更新動畫框架
function animatePlayer() {
  player.frameCounter++;
  if (player.isAttacking) {
    // 攻擊動畫
    if (player.frameCounter >= player.animationSpeed) {
      player.frameCounter = 0;
      player.frameIndex++;
      if (player.frameIndex >= player.attackFrames) {
        player.isAttacking = false;
        player.frameIndex = 0; // 結束後回到初始幀
      }
    }
  } else if (!player.standing) {
    // 行走動畫
    if (player.frameCounter >= player.animationSpeed) {
      player.frameCounter = 0;
      player.frameIndex = (player.frameIndex + 1) % player.totalFrames;
    }
  }
}

// 更新角色的移動與重力
function movePlayer() {
  // 垂直重力處理
  player.dy += player.gravity;
  player.y += player.dy;

  // 防止角色超出地面
  if (player.y + player.height >= canvas.height - 150) {
    player.y = canvas.height - 150 - player.height;
    player.dy = 0;
    player.isJumping = false;
    player.onGround = true;
  }

  // 水平移動
  if (player.dx !== 0) {
    player.x += player.dx;
  }
}

// 處理鍵盤按鍵
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    player.dx = player.speed;
    player.direction = 'right';
    player.standing = false;
  } else if (e.key === 'ArrowLeft') {
    player.dx = -player.speed;
    player.direction = 'left';
    player.standing = false;
  } else if (e.key === ' ' && player.onGround) {
    player.dy = -15;
    player.isJumping = true;
    player.onGround = false;
  } else if (e.key === 'z' || e.key === 'Z') {
    // 檢查是否已經在攻擊狀態，避免重複觸發
    if (!player.isAttacking) {
      player.isAttacking = true;
      player.frameIndex = 0; // 攻擊動畫從頭開始
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    player.dx = 0;
    player.standing = true;
    player.frameIndex = 0; // 回到站立姿勢第一幀
  }
});

// 遊戲主循環
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
  animatePlayer();
  movePlayer();
  requestAnimationFrame(updateGame);
}

// 啟動遊戲循環
updateGame();
