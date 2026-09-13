import { createPlayground } from 'livecodes';

const playground = document.querySelector('.playground-frame');
//LiveCodes 的 iframe 高度要在初始化前设置
playground.style.height = '700px';

createPlayground('#path', {
	config: {
		markup: {
			language: 'HTML',
			content: `
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="text-align:center;font-family:'Jost';background:#222">
<canvas id="snake" width="600" height="600" style="border: 1px solid white;"></canvas>
</body>
</html>
`,
    },
    script: {
      language: 'javascript',
      content: `
//获取画布
const cv = document.getElementById('snake');
//拿到 2D 绘图工具
const ctx = cv.getContext('2d');
//格子边长
const grid = 20;
//一共有几行几列
const columns = cv.width / grid;
const rows = cv.height / grid;
//蛇刚开始只有一个身体格子，位于画布中央
let snake = [{x:15,y:15}];
//蛇初始向右移动：
// x: 1：向右
// x: -1：向左
// y: 1：向下
// y: -1：向上
let dir = {x:1,y:0};
let food = {x:Math.floor(Math.random()*columns),y:Math.floor(Math.random()*rows)};
let score = 0;
let gameState = 'ready';

function resetGame(){
  snake = [{x:15,y:15}];
  dir = {x:1,y:0};
  food = {x:Math.floor(Math.random()*columns),y:Math.floor(Math.random()*rows)};
  score = 0;
  gameState = 'playing';
  draw();
}

//每次调用这个函数，重新画一整帧
function draw(){
  //用深色背景覆盖整个画布，相当于清屏
  ctx.fillStyle = '#222'; ctx.fillRect(0,0,cv.width,cv.height);
  // 食物
  ctx.fillStyle = 'white';
  ctx.fillRect(food.x*grid, food.y*grid, grid, grid);
  // 蛇
  ctx.fillStyle = 'lime';
  snake.forEach(seg => ctx.fillRect(seg.x*grid, seg.y*grid, grid, grid));

  if(gameState !== 'playing'){
    ctx.fillStyle = 'rgba(0, 0, 0, .72)';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 42px Jost';
    ctx.fillText(gameState === 'over' ? 'GAME OVER' : 'SNAKE GAME', cv.width / 2, cv.height / 2 - 35);
    ctx.font = '22px Jost';
    ctx.fillText(gameState === 'over' ? 'score: ' + score : 'press space to start', cv.width / 2, cv.height / 2 + 15);
    if(gameState === 'over'){
      ctx.fillText('press space to restart', cv.width / 2, cv.height / 2 + 55);
    }
  }
}

function tick(){
  if(gameState !== 'playing') return;

  // 计算蛇头的新位置
  const head = { 
    x: snake[0].x + dir.x, 
    y: snake[0].y + dir.y 
  };
  // 撞墙
  if(head.x<0||head.x>=columns||head.y<0||head.y>=rows){
    gameState = 'over';
    draw();
    return;
  }
  // 撞自己
  if(snake.some(seg => seg.x===head.x && seg.y===head.y)){
    gameState = 'over';
    draw();
    return;
  }
  //每次移动时把新的蛇头 head 放到蛇数组的最前面
  snake.unshift(head);
  if(head.x===food.x && head.y===food.y){
    score++;
    food = { x: Math.floor(Math.random()*columns), y: Math.floor(Math.random()*rows) };
  } else {
  //如果没有吃到食物，就把蛇尾去掉
    snake.pop();
  }
  draw();
}

document.addEventListener('keydown', e => {
  if(e.code === 'Space'){
    e.preventDefault();
    if(gameState !== 'playing') resetGame();
    return;
  }

  //监听键盘按键
  const map = { 
    ArrowUp:{x:0,y:-1}, 
    ArrowDown:{x:0,y:1}, 
    ArrowLeft:{x:-1,y:0}, 
    ArrowRight:{x:1,y:0} 
  };
  const newDir = map[e.key];
  if (newDir) {
    //在贪吃蛇预览中按键盘上下左右时，页面和游戏内部不要跟着滚动
    e.preventDefault();
    if (!(newDir.x === -dir.x && newDir.y === -dir.y)) {
      dir = newDir;// 禁止掉头
    }
  }
});

setInterval(tick, 50);
//等待字体加载后首次绘制
document.fonts.ready.then(() => {
  draw();
});
`,
		},
		theme: 'dark',
		themeColor: '#03a9f4',
		editorTheme: 'monaco:monokai@dark, codemirror:one-dark@dark',
		fontFamily: 'Space Grotesk, Consolas, monospace',
		fontSize: 14,
		layout: 'horizontal',
	},
	view: 'split',
});
