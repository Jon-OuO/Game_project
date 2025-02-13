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

// 設置地塊圖片路徑
const firstLayerBlockImages = [
  'game_screen/background/block/Tile (1).png',
  'game_screen/background/block/Tile (2).png',
  'game_screen/background/block/Tile (3).png'
];
const secondLayerBlockImages = [
  'game_screen/background/block/Tile (4).png',
  'game_screen/background/block/Tile (5).png',
  'game_screen/background/block/Tile (6).png'
];

const thirdLayerBlockImages = [
  'game_screen/background/block/Tile (12).png',
  'game_screen/background/block/Tile (9).png',
  'game_screen/background/block/Tile (13).png'
];
const blockWidth = 128; // 地塊基準寬度
const blockHeight = 128; // 地塊基準高度

const obstacles = [
  // 初始化障礙物物件陣列
  {
    image: new Image(),
    x: 500,
    y: canvas.height - (-330),
    width: 60,
    height: 60
  },
  {
    image: new Image(),
    x: 1000,
    y: canvas.height - (-330),
    width: 60,
    height: 60
  }
];
obstacles[0].image.src = 'game_screen/background/obstacle/TombStone (1).png';
obstacles[1].image.src = 'game_screen/background/obstacle/TombStone (2).png';

// 繪製障礙物
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}


function checkObstacleCollision() {
  obstacles.forEach(obstacle => {
    const playerBottom = player.y + player.height;
    const obstacleTop = obstacle.y;
    const playerRight = player.x + player.width;
    const obstacleRight = obstacle.x + obstacle.width;

    // 檢查角色從上方落在障礙物頂部
    if (
      playerBottom > obstacleTop &&                    // 角色底部在障礙物頂部之下
      player.dy >= 0 &&                                // 角色正在下降
      playerBottom - player.dy <= obstacleTop &&       // 上一幀不在障礙物內
      playerRight > obstacle.x &&                      // 水平方向有重疊
      player.x < obstacleRight
    ) {
      player.y = obstacleTop - player.height;          // 調整角色位置到障礙物頂部
      player.dy = 0;                                   // 停止垂直移動
      player.onGround = true;                          // 設定角色在地面
      player.isJumping = false;                        // 停止跳躍狀態
    }

    // 檢查左右方向的碰撞，避免角色穿過障礙物
    if (
      playerBottom > obstacleTop + 10 &&               // 角色底部已超過障礙物的頂部
      player.y < obstacleTop + obstacle.height &&      // 角色在障礙物高度範圍內
      playerRight > obstacle.x &&                      // 水平方向重疊
      player.x < obstacleRight
    ) {
      // 僅在角色的水平移動速度不為零時才處理碰撞
      if (player.dx > 0) {
        player.x = obstacle.x - player.width;          // 阻止角色向右穿過障礙物
      } else if (player.dx < 0) {
        player.x = obstacleRight;                      // 阻止角色向左穿過障礙物
      }
    }
  });
}

// 設置角色屬性
const player = {
  x: 100,
  y: canvas.height - 140,
  width: 50, // 基準角色寬度
  height: 50, // 基準角色高度
  speed: 2, // 移動速度
  dx: 0,  // 水平方向速度
  dy: 0,  // 垂直方向速度
  gravity: 0.8,  // 垂直重力加速度
  isJumping: false,  // 跳躍狀態
  onGround: false,  // 是否在地面
  direction: 'right',  // 初始角色朝向
  frameIndex: 0,  // 精靈動畫幀索引
  frameCounter: 0,  // 精靈動畫計數器
  totalFrames: 9,  // 行走動畫幀數
  attackFrames: 6,  // 攻擊動畫幀數
  animationSpeed: 12,  // 動畫速度(數字越高越慢)
  standing: true,  // 是否站立
  isAttacking: false,  // 是否在攻擊
  frameWidth: 64  // 單幀寬度
};

// 設置背景偏移量
let bgOffsetX = 0;
const bgWidth = 2000; // 基準背景寬度

// 儲存第一層到第三層的地塊
const firstLayerBlocks = [];
const secondLayerBlocks = [];
const thirdLayerBlocks = [];

// 初始化第一層地塊
for (let i = 0; i < 15; i++) {
  const blockImageIndex = i === 0 ? 0 : i === 14 ? 2 : 1;
  const block = {
    image: new Image(),
    x: 100 + i * blockWidth,
    y: canvas.height - 150,
    width: blockWidth,
    height: blockHeight
  };
  block.image.src = firstLayerBlockImages[blockImageIndex];
  firstLayerBlocks.push(block);
}

// 初始化第二層地塊
for (let i = 0; i < 15; i++) {
  const blockImageIndex = i === 0 ? 0 : i === 14 ? 2 : 1;
  const block = {
    image: new Image(),
    x: 100 + i * blockWidth, // 第二層偏移
    y: canvas.height - 150 - blockHeight,
    width: blockWidth,
    height: blockHeight
  };
  block.image.src = secondLayerBlockImages[blockImageIndex];
  secondLayerBlocks.push(block);
}
// 初始化第三層地塊
for (let i = 0; i < 15; i++) {
  const blockImageIndex = i === 0 ? 0 : i === 14 ? 2 : 1;
  const block = {
    image: new Image(),
    x: 100 + i * blockWidth, // 第三層偏移
    y: canvas.height - 150, // 先使用基準值，稍後在resizeCanvas內更新
    width: blockWidth,
    height: blockHeight
  };
  block.image.src = thirdLayerBlockImages[blockImageIndex];
  thirdLayerBlocks.push(block);
}

// 設置畫布大小並調整地塊尺寸和位置
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const scaleFactor = canvas.height / 800; // 基準高度為800

  player.width = 100 * scaleFactor;
  player.height = 100 * scaleFactor;

  // 更新第一層地塊
  firstLayerBlocks.forEach((block, i) => {
    block.width = blockWidth * scaleFactor;
    block.height = blockHeight * scaleFactor;
    block.x = 0 * scaleFactor + i * block.width;
    block.y = canvas.height - block.height - 150 * scaleFactor;
  });

   // 更新第二層地塊
   secondLayerBlocks.forEach((block, i) => {
    block.width = blockWidth * scaleFactor;
    block.height = blockHeight * scaleFactor;
    block.x = 0 * scaleFactor + i * block.width;
    block.y = canvas.height - block.height - 22 * scaleFactor; // 土塊數據設置
  });

  // 更新第三層地塊
  thirdLayerBlocks.forEach((block, i) => {
    block.width = blockWidth * scaleFactor;
    block.height = blockHeight * scaleFactor;
    block.x = 0 * scaleFactor + i * block.width;
    block.y = canvas.height - block.height - (-106) * scaleFactor; // 土塊數據設置
  });

  player.y = firstLayerBlocks[0].y - player.height; // 角色置於地塊上
}
resizeCanvas(); // 初始執行畫布大小設置
window.addEventListener('resize', resizeCanvas); // 視窗大小變動時重新調整

// 繪製背景
function drawBackground() {
  const scaleFactor = canvas.height / bgImage.height; // 計算縮放比例
  const scaledBgWidth = bgImage.width * scaleFactor;  // 計算縮放後的背景寬度

  // 繪製背景重複滾動
  ctx.drawImage(bgImage, bgOffsetX, 0, scaledBgWidth, canvas.height);
  ctx.drawImage(bgImage, bgOffsetX + scaledBgWidth, 0, scaledBgWidth, canvas.height);

  if (bgOffsetX <= -scaledBgWidth) { // 重設背景偏移量以重複滾動
    bgOffsetX = 0;
  }
}

// 更新畫面上的所有地塊繪製函數
function drawBlocks() {
  // 繪製第一層地塊
  firstLayerBlocks.forEach(block => {
    ctx.drawImage(block.image, block.x, block.y, block.width, block.height);
  });

  // 繪製第二層地塊
  secondLayerBlocks.forEach(block => {
    ctx.drawImage(block.image, block.x, block.y, block.width, block.height);
  });

  // 繪製第三層地塊
  thirdLayerBlocks.forEach(block => {
    ctx.drawImage(block.image, block.x, block.y, block.width, block.height);
  });
}


// 繪製角色
function drawPlayer() {
  const sprite = player.isAttacking ? 
                (player.direction === 'right' ? attackRight : attackLeft) : 
                (player.direction === 'right' ? spriteRightWalk : spriteLeftWalk);
  let spriteX;
      if (player.isJumping) {
          // 這裡可設定跳躍時的精靈圖
          spriteX = 0; // 假設跳躍時使用第一幀
          } else {
                    spriteX = player.frameIndex * player.frameWidth; // 精靈圖在X方向的位置
                }

  ctx.drawImage(
    sprite,
    spriteX, 0, player.frameWidth, sprite.height, // 原始精靈圖的切割寬高
    player.x, player.y, player.width, player.height // 繪製到畫布的縮放後尺寸
  );
}

// 更新角色動畫幀
function animatePlayer() {
  player.frameCounter++;

  if (player.isAttacking) { // 角色攻擊狀態
    if (player.frameCounter >= player.animationSpeed) {
      player.frameCounter = 0;
      player.frameIndex++;
      if (player.frameIndex >= player.attackFrames) {
        player.isAttacking = false; // 結束攻擊
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

// 更新角色移動
function movePlayer() { // 垂直重力處理
  if (!player.onGround) {
    player.dy += player.gravity; 
  }
  player.y += player.dy;

  // 確保角色不超過地面
  if (player.y + player.height >= canvas.height - 150) {
    player.y = canvas.height - 150 - player.height;
    player.dy = 0;
    player.isJumping = false;
    player.onGround = true;
  }

  // 檢測角色與地塊碰撞
  firstLayerBlocks.forEach(block => {
    const collisionPadding = 10;
    const playerBottom = player.y + player.height;
    const blockTop = block.y;

    if (
      player.x + player.width - collisionPadding > block.x &&
      player.x + collisionPadding < block.x + block.width &&
      playerBottom > blockTop &&
      playerBottom - player.dy <= blockTop
    ) {
      player.y = blockTop - player.height;
      player.dy = 0;
      player.isJumping = false;
      player.onGround = true;
    }
  });

  if (player.dx !== 0 && !player.isAttacking) {
    const maxPlayerX = canvas.width * 0.5;

    // 移動角色
    if (player.x < maxPlayerX || (player.x > maxPlayerX && bgOffsetX <= -bgWidth)) {
      player.x += player.dx;

      // 限制角色不離開畫面左側邊界
      if (player.x < 0) {
        player.x = 0;
      }

      // 限制角色不離開畫面右側邊界
      if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
    } else {
      // 更新背景偏移量，並限制其最小值為0，避免背景錯位
      bgOffsetX -= player.dx;
      bgOffsetX = Math.min(0, bgOffsetX); // 當 bgOffsetX 超過0時，限制其不再減小
      firstLayerBlocks.forEach(block => block.x -= player.dx);
      secondLayerBlocks.forEach(block => block.x -= player.dx);
      thirdLayerBlocks.forEach(block => block.x -= player.dx);
    }
  }
}

// 處理鍵盤事件
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && !player.isAttacking) {
    player.dx = player.speed;
    player.direction = 'right';
    player.standing = false;
  } else if (e.key === 'ArrowLeft' && !player.isAttacking) {
    player.dx = -player.speed;
    player.direction = 'left';
    player.standing = false;
  } else if (e.key === ' ' && player.onGround) {
    player.dy = -15;
    player.isJumping = true;
    player.onGround = false;
  } else if (e.key === 'z' || e.key === 'Z') {
    player.isAttacking = true;
    player.frameIndex = 0;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    player.dx = 0;
    player.standing = true;
  }
});

// 更新遊戲畫面
function update() {
  movePlayer();
  checkObstacleCollision();
  animatePlayer();
}

// 渲染遊戲畫面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBlocks();
  drawObstacles();
  drawPlayer();
}

// 遊戲主循環
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBlocks(); // 繪製所有地塊
  drawObstacles(); //繪製障礙物
  movePlayer();
  checkObstacleCollision(); // ：檢測障礙物碰撞
  animatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop); // 持續遊戲循環
}

// 啟動遊戲主循環
gameLoop();