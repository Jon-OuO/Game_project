// 獲取 Canvas 上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 設置背景圖片路徑
const bgImage = new Image();
bgImage.src = 'game_screen/background/background_0.png';

// 載入角色精靈圖
const spriteRightWalk = new Image();
spriteRightWalk.src = 'game_screen/player/human_walk_right.png';
const spriteLeftWalk = new Image();
spriteLeftWalk.src = 'game_screen/player/human_walk_left.png';
const attackRight = new Image();
attackRight.src = 'game_screen/player/human_attack_right.png';
const attackLeft = new Image();
attackLeft.src = 'game_screen/player/human_attack_left.png';

// 設置地塊數據
const blockImages = [
  'game_screen/background/block/Tile (1).png',
  'game_screen/background/block/Tile (2).png',
  'game_screen/background/block/Tile (3).png'
];
const blockWidth = 128; // 地塊的基準寬度
const blockHeight = 128; // 地塊的基準高度

// 設置角色屬性
const player = {
  x: 100,  // 角色初始位置
  y: canvas.height - 150,
  width: 100,  // 基準角色寬度
  height: 100,  // 基準角色高度
  speed: 3,  // 移動速度
  dx: 0,  // 水平方向速度
  dy: 0,  // 垂直方向速度
  gravity: 0.8,  // 垂直重力加速度
  isJumping: false,  // 跳躍狀態
  onGround: false,  // 是否在地面
  direction: 'right',  // 朝向
  frameIndex: 0,  // 精靈動畫幀索引
  frameCounter: 0,  // 精靈動畫計數器
  totalFrames: 9,  // 行走動畫幀數
  attackFrames: 6,  // 攻擊動畫幀數
  animationSpeed: 7,  // 動畫速度
  standing: true,  // 是否站立
  isAttacking: false,  // 是否在攻擊
  frameWidth: 64  // 單幀寬度
};

// 設定背景偏移量（控制背景的水平滾動）
let bgOffsetX = 0;
const bgWidth = 2000; // 基準背景寬度（單一背景的寬度，用於循環）

// 自動生成地塊
const blocks = [];
for (let i = 0; i < 12; i++) {
  const blockImageIndex = i === 0 ? 0 : i === 11 ? 2 : 1; // 第一和最後地塊使用不同圖片
  const block = {
    image: new Image(),
    x: 100 + i * blockWidth, // X位置依序排列
    y: canvas.height - 150,  // Y位置設定在視窗底部
    width: blockWidth,
    height: blockHeight
  };
  block.image.src = blockImages[blockImageIndex];
  blocks.push(block);
}

// 設置畫布為全視窗大小
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 計算縮放比例
  const scaleFactor = canvas.height / 800; // 基準高度為 800

  // 更新角色的尺寸
  player.width = 100 * scaleFactor;
  player.height = 100 * scaleFactor;

  // 更新地塊尺寸和位置
  blocks.forEach((block, i) => {
    block.width = blockWidth * scaleFactor;
    block.height = blockHeight * scaleFactor;
    block.x = 0 * scaleFactor + i * block.width;
    block.y = canvas.height - block.height - 150 * scaleFactor;
  });

  // 更新角色位置，確保在地塊之上
  player.y = blocks[0].y - player.height;
}
resizeCanvas(); // 初始執行畫布大小設置
window.addEventListener('resize', resizeCanvas); // 視窗大小變動時重新調整

// 繪製背景，應用縮放比例
function drawBackground() {
  const scaleFactor = canvas.height / bgImage.height; // 計算縮放比例
  const scaledBgWidth = bgImage.width * scaleFactor;  // 計算縮放後的背景寬度

  // 繪製兩張背景圖片並重複
  ctx.drawImage(bgImage, bgOffsetX, 0, scaledBgWidth, canvas.height);
  ctx.drawImage(bgImage, bgOffsetX + scaledBgWidth, 0, scaledBgWidth, canvas.height);

  if (bgOffsetX <= -scaledBgWidth) {  // 重設背景偏移量以重複滾動
    bgOffsetX = 0;
  }
}

// 繪製地塊
function drawBlocks() {
  blocks.forEach(block => {
    ctx.drawImage(block.image, block.x, block.y, block.width, block.height);
  });
}

// 繪製角色並應用縮放
function drawPlayer() {
  const sprite = player.isAttacking ? 
                (player.direction === 'right' ? attackRight : attackLeft) : 
                (player.direction === 'right' ? spriteRightWalk : spriteLeftWalk);
  
  const spriteX = player.frameIndex * player.frameWidth; // 精靈圖在X方向的位置

  ctx.drawImage(
    sprite,
    spriteX, 0, player.frameWidth, sprite.height, // 原始精靈圖的切割寬高
    player.x, player.y, player.width, player.height // 繪製到畫布的縮放後尺寸
  );
}

// 更新角色動畫幀
function animatePlayer() {
  player.frameCounter++;

  if (player.isAttacking) {  // 角色攻擊狀態
    if (player.frameCounter >= player.animationSpeed) {
      player.frameCounter = 0;
      player.frameIndex++;
      if (player.frameIndex >= player.attackFrames) {
        player.isAttacking = false;  // 結束攻擊
        player.frameIndex = 0;
      }
    }
  } else if (!player.standing && !player.isJumping) { // 角色行走狀態
    if (player.frameCounter >= player.animationSpeed) {
      player.frameCounter = 0;
      player.frameIndex = (player.frameIndex + 1) % player.totalFrames; // 循環行走動畫幀
    }
  } else if (player.standing) { // 角色站立時顯示第一幀
    player.frameIndex = 0;
  }
}

// 更新角色的移動與重力
function movePlayer() {
  player.dy += player.gravity; // 應用重力
  player.y += player.dy;

  // 確保角色不超過地面
  if (player.y + player.height >= canvas.height - 150) {
    player.y = canvas.height - 150 - player.height;
    player.dy = 0;
    player.isJumping = false;
    player.onGround = true;
  }

  // 檢測角色與地塊碰撞
  blocks.forEach(block => {
    const collisionPadding = 10; // X軸碰撞邊界填充
    const playerBottom = player.y + player.height;
    const blockTop = block.y;

    if (
      player.x + player.width - collisionPadding > block.x &&
      player.x + collisionPadding < block.x + block.width &&
      playerBottom > blockTop &&
      playerBottom - player.dy <= blockTop &&
      player.x + player.width > block.x + collisionPadding &&
      player.x < block.x + block.width - collisionPadding
    ) {
      player.y = blockTop - player.height; // 將角色放置於地塊上
      player.dy = 0;
      player.isJumping = false;
      player.onGround = true;
    }
  });

  // 控制角色移動與背景偏移
  if (player.dx !== 0 && !player.isAttacking) { // 攻擊時不移動
    const maxPlayerX = canvas.width * 0.5; // 控制角色於畫布中間
    if (player.x < maxPlayerX || (player.x > maxPlayerX && bgOffsetX <= -bgWidth)) {
      player.x += player.dx;
    } else {
      bgOffsetX -= player.dx;
      blocks.forEach(block => block.x -= player.dx);
    }
  }
}

// 處理鍵盤按鍵
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && !player.isAttacking) { // 右移
    player.dx = player.speed;
    player.direction = 'right';
    player.standing = false;
  } else if (e.key === 'ArrowLeft' && !player.isAttacking) { // 左移
    player.dx = -player.speed;
    player.direction = 'left';
    player.standing = false;
  } else if (e.key === ' ' && player.onGround) { // 跳躍
    player.dy = -15;
    player.isJumping = true;
    player.onGround = false;
  } else if (e.key === 'z' || e.key === 'Z') { // 攻擊
    player.isAttacking = true;
    player.frameIndex = 0;
  }
});

// 停止角色左右移動
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    player.dx = 0;
    player.standing = true;
  }
});

// 遊戲更新和繪製循環
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBlocks();
  movePlayer();
  animatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop); // 持續遊戲循環
}
gameLoop(); // 啟動遊戲
