/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */
/* eslint-disable default-case */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
import React, { useRef, useEffect, useState } from "react";
// import ReactDOM from "react-dom"; // 不再需要 ReactDOM
import "./index.css";

const App = () => {
  const myRef = useRef();
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  // 存储游戏状态和清理函数
  const gameRef = useRef({
    timers: [],
    eventListeners: [],
    ourplane: null,
    cleanup: () => {}
  });

  // 清理所有游戏资源
  const cleanupGame = () => {
    const { timers, eventListeners } = gameRef.current;
    
    // 清理定时器
    timers.forEach(timer => clearInterval(timer));
    gameRef.current.timers = [];
    
    // 清理事件监听器
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    gameRef.current.eventListeners = [];
    
    // 清理DOM
    const planebox = myRef.current;
    if (planebox) {
      // 移除所有游戏相关的img元素（保留分数显示）
      const gameImages = planebox.querySelectorAll('img');
      gameImages.forEach(img => {
        if (planebox.contains(img)) {
          planebox.removeChild(img);
        }
      });
    }
    
    gameRef.current.ourplane = null;
  };

  // 初始化游戏
  const initializeGame = () => {
    const planebox = myRef.current;
    if (!planebox) return;
    
    let allscore = 0;
    const ranNum = (min, max) => {
      return Math.round(Math.random() * (max - min)) + min;
    };

    // 背景运动
    let bgposition = 0;
    const bgtimer = setInterval(() => {
      bgposition += 2;
      planebox.style.backgroundPosition = `0 ${bgposition}px`;
    }, 1000 / 60);
    gameRef.current.timers.push(bgtimer);

    // 角色基类
    class Role {
      constructor(w, h, x, y, imgurl, boomurl) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.imgurl = imgurl;
        this.boomurl = boomurl;
      }
      createRole() {
        this.roleimg = document.createElement("img");
        this.roleimg.src = this.imgurl;
        this.roleimg.style.cssText = `
               width:${this.w}px;
               height:${this.h}px;
               position:absolute;
               left:${this.x}px;
               top:${this.y}px;
           `;
        planebox.appendChild(this.roleimg);
      }
    }
    
    // 子弹类
    class Bullet extends Role {
      constructor(w, h, x, y, imgurl) {
        super(w, h, x, y, imgurl);
        this.createRole();
        this.bulletMove();
      }

      bulletMove() {
        this.timer = setInterval(() => {
          this.y -= 3;
          if (this.y <= -this.h) {
            clearInterval(this.timer);
            if (planebox.contains(this.roleimg)) {
              planebox.removeChild(this.roleimg);
            }
          }
          this.roleimg.style.top = this.y + "px";
          this.bullethit();
        }, 1000 / 600);
        gameRef.current.timers.push(this.timer);
      }

      bullethit() {
        const enemys = document.querySelectorAll(".enemy");
        for (let i = 0; i < enemys.length; i++) {
          if (
            this.x + this.w >= enemys[i].offsetLeft &&
            this.x <= enemys[i].offsetLeft + enemys[i].offsetWidth &&
            this.y + this.h >= enemys[i].offsetTop &&
            this.y <= enemys[i].offsetTop + enemys[i].offsetHeight
          ) {
            try {
              if (planebox.contains(this.roleimg)) {
                planebox.removeChild(this.roleimg);
              }
            } catch (e) {
              return;
            }
            clearInterval(this.timer);
            enemys[i].blood--;
            enemys[i].checkblood();
          }
        }
      }
    }
    
    // 我方飞机类
    class Myplane extends Role {
      constructor(w, h, x, y, imgurl, boomurl) {
        super(w, h, x, y, imgurl, boomurl);
        this.createRole();
        this.myplaneMove();
        this.myplaneShoot();
      }
      myplaneMove() {
        let _this = this;
        let uptimer = null,
          downtimer = null,
          lefttimer = null,
          righttimer = null;
        
        const planemove = (ev) => {
          var ev = ev || window.event;
          switch (ev.keyCode) {
            case 87:
              moveup();
              break;
            case 83:
              movedown();
              break;
            case 65:
              moveleft();
              break;
            case 68:
              moveright();
              break;
          }
          
          function moveup() {
            clearInterval(uptimer);
            clearInterval(downtimer);
            uptimer = setInterval(() => {
              _this.y -= 4;
              if (_this.y <= 0) {
                _this.y = 0;
              }
              _this.roleimg.style.top = _this.y + "px";
            }, 1000 / 60);
            gameRef.current.timers.push(uptimer);
          }
          
          function movedown() {
            clearInterval(downtimer);
            clearInterval(uptimer);
            downtimer = setInterval(() => {
              _this.y += 4;
              if (_this.y >= planebox.offsetHeight - _this.h) {
                _this.y = planebox.offsetHeight - _this.h;
              }
              _this.roleimg.style.top = _this.y + "px";
            }, 1000 / 60);
            gameRef.current.timers.push(downtimer);
          }

          function moveleft() {
            clearInterval(lefttimer);
            clearInterval(righttimer);
            lefttimer = setInterval(() => {
              _this.x -= 4;
              if (_this.x <= 0) {
                _this.x = 0;
              }
              _this.roleimg.style.left = _this.x + "px";
            }, 1000 / 60);
            gameRef.current.timers.push(lefttimer);
          }

          function moveright() {
            clearInterval(righttimer);
            clearInterval(lefttimer);
            righttimer = setInterval(() => {
              _this.x += 4;
              if (_this.x >= planebox.offsetWidth - _this.w) {
                _this.x = planebox.offsetWidth - _this.w;
              }
              _this.roleimg.style.left = _this.x + "px";
            }, 1000 / 60);
            gameRef.current.timers.push(righttimer);
          }
        };

        document.addEventListener("keydown", planemove);
        gameRef.current.eventListeners.push({ element: document, event: "keydown", handler: planemove });

        document.addEventListener("keyup", (ev) => {
          var ev = ev || window.event;
          if (ev.keyCode === 87) {
            clearInterval(uptimer);
          }
          if (ev.keyCode === 83) {
            clearInterval(downtimer);
          }
          if (ev.keyCode === 65) {
            clearInterval(lefttimer);
          }
          if (ev.keyCode === 68) {
            clearInterval(righttimer);
          }
        });
      }
      
      myplaneShoot() {
        let _this = this;
        let shoottimer = null;
        let flag = true;

        const shootbullet = (ev) => {
          var ev = ev || window.event;
          if (ev.keyCode === 75) {
            if (flag) {
              flag = false;
              const shoot = () => {
                new Bullet(
                  6,
                  14,
                  _this.x + _this.w / 2 - 3,
                  _this.y - 14,
                  require("./img/bullet.png")
                );
              };
              shoot();
              clearInterval(shoottimer);
              shoottimer = setInterval(shoot, 20);
              gameRef.current.timers.push(shoottimer);
            }
          }
        };
        
        document.addEventListener("keydown", shootbullet);
        gameRef.current.eventListeners.push({ element: document, event: "keydown", handler: shootbullet });
      }
    }
    
    // 敌机类
    class Enemy extends Role {
      constructor(w, h, x, y, imgurl, boomurl, speed, blood, score) {
        super(w, h, x, y, imgurl, boomurl);
        this.speed = speed;
        this.blood = blood;
        this.score = score;
        this.createRole();
        this.enemyMove();
        this.setattribute();
      }
      
      setattribute() {
        let _this = this;
        this.roleimg.className = "enemy";
        this.roleimg.blood = this.blood;
        this.roleimg.score = this.score;
        this.roleimg.checkblood = function () {
          if (this.blood === 0) {
            this.src = _this.boomurl;
            this.className = "";
            clearInterval(this.timer);
            setTimeout(() => {
              if (planebox.contains(this)) {
                planebox.removeChild(this);
              }
            }, 400);
            allscore += this.score;
            setScore(allscore);
          }
        };
      }

      enemyMove() {
        this.roleimg.timer = setInterval(() => {
          this.y += this.speed;
          if (this.y >= planebox.offsetHeight) {
            clearInterval(this.roleimg.timer);
            if (planebox.contains(this.roleimg)) {
              planebox.removeChild(this.roleimg);
            }
          }
          if (gameRef.current.ourplane && !gameOver) {
            this.enemyhit();
          }
          this.roleimg.style.top = this.y + "px";
        }, 1000 / 60);
        gameRef.current.timers.push(this.roleimg.timer);
      }

      enemyhit() {
        const ourplane = gameRef.current.ourplane;
        if (
          ourplane &&
          this.x + this.w >= ourplane.x &&
          this.x <= ourplane.x + ourplane.w &&
          this.y + this.h >= ourplane.y &&
          this.y <= ourplane.y + ourplane.h
        ) {
          setGameOver(true);
          
          const enemys = document.querySelectorAll(".enemy");
          for (let i = 0; i < enemys.length; i++) {
            enemys[i].className = "";
            if (enemys[i].timer) {
              clearInterval(enemys[i].timer);
            }
          }
          
          if (ourplane.roleimg) {
            ourplane.roleimg.src = ourplane.boomurl;
          }
          
          // 清理所有定时器但保留爆炸效果
          gameRef.current.timers.forEach(timer => clearInterval(timer));
        }
      }
    }
    
    // 生成敌机
    const enemyTimer = setInterval(() => {
      if (gameOver) {
        clearInterval(enemyTimer);
        return;
      }
      
      for (let i = 1; i <= ranNum(1, 3); i++) {
        let num = ranNum(1, 20);
        if (num >= 1 && num < 15) {
          new Enemy(
            34,
            24,
            ranNum(0, planebox.offsetWidth - 34),
            -24,
            require("./img/smallplane.png"),
            require("./img/smallplaneboom.gif"),
            ranNum(1, 3),
            1,
            1
          );
        } else if (num >= 15 && num < 20) {
          new Enemy(
            46,
            60,
            ranNum(0, planebox.offsetWidth - 46),
            -60,
            require("./img/midplane.png"),
            require("./img/midplaneboom.gif"),
            ranNum(1, 2),
            3,
            3
          );
        } else if (num === 20) {
          new Enemy(
            110,
            164,
            ranNum(0, planebox.offsetWidth - 110),
            -164,
            require("./img/bigplane.png"),
            require("./img/bigplaneboom.gif"),
            1,
            10,
            10
          );
        }
      }
    }, 1000);
    gameRef.current.timers.push(enemyTimer);
    
    // 空格暂停
    const handleSpaceKey = (ev) => {
      var ev = ev || window.event;
      if (ev.keyCode === 32) {
        gameRef.current.timers.forEach(timer => clearInterval(timer));
      }
    };
    document.addEventListener("keydown", handleSpaceKey);
    gameRef.current.eventListeners.push({ element: document, event: "keydown", handler: handleSpaceKey });
    
    // 初始化我方飞机
    gameRef.current.ourplane = new Myplane(
      66,
      80,
      (planebox.offsetWidth - 66) / 2,
      planebox.offsetHeight - 80,
      require("./img/myplane.gif"),
      require("./img/myplaneBoom.gif")
    );
  };

  const restartGame = () => {
    // 清理当前游戏
    cleanupGame();
    
    // 重置状态
    setGameOver(false);
    setScore(0);
    
    // 延迟重新初始化
    setTimeout(() => {
      if (myRef.current && !gameOver) {
        initializeGame();
      }
    }, 100);
  };

  useEffect(() => {
    if (!gameOver) {
      // 延迟初始化确保DOM渲染完成
      const initTimer = setTimeout(() => {
        initializeGame();
      }, 100);
      
      return () => {
        clearTimeout(initTimer);
        cleanupGame();
      };
    }
  }, [gameOver]);

  return (
    <div className="App">
      <div ref={myRef} className="planebox">
        <span>
          分数：<strong>{score}</strong>
        </span>
      </div>
      
      {gameOver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h2>Game Over!</h2>
            <p>最终得分: {score}</p>
            <button onClick={restartGame} style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              重新开始
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;