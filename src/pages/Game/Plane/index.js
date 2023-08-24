/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */
/* eslint-disable default-case */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App = () => {
  const myRef = useRef();
  useEffect(() => {
    // 1.获取元素
    const planebox = ReactDOM.findDOMNode(myRef.current);
    const score = document.querySelector(".planebox strong");
    let allscore = 0; // 计算总分
    const ranNum = (min, max) => {
      return Math.round(Math.random() * (max - min)) + min;
    };

    // 2.让背景运动(背景的垂直方向是重复的)
    let bgposition = 0; // 背景的位置

    let bgtimer =
      planebox &&
      setInterval(() => {
        bgposition += 2;
        planebox.style.backgroundPosition = `0 ${bgposition}px`;
      }, 1000 / 60);

    // 3.创建飞机角色的类(被继承的)
    class Role {
      constructor(w, h, x, y, imgurl, boomurl) {
        //w宽h高x水平位置y垂直位置imgurl图片路径boourl爆炸的图片路径
        this.w = w; //赋值
        this.h = h; //赋值
        this.x = x; //赋值
        this.y = y; //赋值
        this.imgurl = imgurl; //赋值
        this.boomurl = boomurl; //赋值
      }
      createRole() {
        //创建角色图片
        this.roleimg = document.createElement("img");
        this.roleimg.src = this.imgurl; //赋值图片地址
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
    //5.子弹类
    class Bullet extends Role {
      constructor(w, h, x, y, imgurl) {
        super(w, h, x, y, imgurl); //继承了属性和方法
        this.createRole(); //创建子弹的角色。
        this.bulletMove(); //子弹移动。
      }

      bulletMove() {
        this.timer = setInterval(() => {
          //子弹运动，一个子弹一个定时器
          this.y -= 3;
          if (this.y <= -this.h) {
            //判断子弹除了盒子区域
            clearInterval(this.timer); //关闭定时器
            planebox.removeChild(this.roleimg); //移出子弹
          }
          this.roleimg.style.top = this.y + "px";
          this.bullethit(); //子弹碰撞敌机,子弹运动的过程中进行碰撞检测。
        }, 1000 / 600);
      }

      bullethit() {
        //子弹碰撞敌机
        const enemys = document.querySelectorAll(".enemy");
        for (let i = 0; i < enemys.length; i++) {
          if (
            this.x + this.w >= enemys[i].offsetLeft &&
            this.x <= enemys[i].offsetLeft + enemys[i].offsetWidth &&
            this.y + this.h >= enemys[i].offsetTop &&
            this.y <= enemys[i].offsetTop + enemys[i].offsetHeight
          ) {
            try {
              planebox.removeChild(this.roleimg); //子弹消失
            } catch (e) {
              return;
            }
            clearInterval(this.timer); //子弹的定时器关闭
            enemys[i].blood--;
            enemys[i].checkblood(); //将检测血量的方法绑定在每一个敌机身上。
          }
        }
      }
    }
    //4.我方飞机类
    class Myplane extends Role {
      constructor(w, h, x, y, imgurl, boomurl) {
        super(w, h, x, y, imgurl, boomurl); //继承了属性和方法
        this.createRole(); //创建我方飞机的角色。
        this.myplaneMove(); //我方飞机移动。
        this.myplaneShoot(); //我方飞机发射子弹
      }
      myplaneMove() {
        //我方飞机移动(W87A65S83D68控制方向,K75控制发射子弹)
        let _this = this;
        let uptimer = null,
          downtimer = null,
          lefttimer = null,
          righttimer = null;
        //按下按键触发事件
        document.addEventListener("keydown", planemove);

        function planemove(ev) {
          //事件处理函数
          var ev = ev || window.event;
          switch (ev.keyCode) {
            case 87:
              moveup(); //普通函数
              break;
            case 83:
              movedown(); //普通函数
              break;
            case 65:
              moveleft(); //普通函数
              break;
            case 68:
              moveright(); //普通函数
              break;
          }
          //向上运动
          //如果同时上下运动，飞机出现抖动，不知道往那边。
          function moveup() {
            clearInterval(uptimer); //防止事件下面的定时器叠加
            clearInterval(downtimer); //防止上下键同时按。
            uptimer = setInterval(() => {
              _this.y -= 4; //速度叠加
              if (_this.y <= 0) {
                _this.y = 0;
              }
              _this.roleimg.style.top = _this.y + "px"; //赋值
            }, 1000 / 60);
          }
          //向下运动
          function movedown() {
            clearInterval(downtimer); //防止事件下面的定时器叠加
            clearInterval(uptimer);
            downtimer = setInterval(() => {
              _this.y += 4; //速度叠加
              if (_this.y >= planebox.offsetHeight - _this.h) {
                _this.y = planebox.offsetHeight - _this.h;
              }
              _this.roleimg.style.top = _this.y + "px"; //赋值
            }, 1000 / 60);
          }

          //左右运动
          function moveleft() {
            clearInterval(lefttimer); //防止事件下面的定时器叠加
            clearInterval(righttimer); //防止上下键同时按。
            lefttimer = setInterval(() => {
              _this.x -= 4; //速度叠加
              if (_this.x <= 0) {
                _this.x = 0;
              }
              _this.roleimg.style.left = _this.x + "px"; //赋值
            }, 1000 / 60);
          }

          function moveright() {
            clearInterval(righttimer); //防止上下键同时按。
            clearInterval(lefttimer); //防止事件下面的定时器叠加
            righttimer = setInterval(() => {
              _this.x += 4; //速度叠加
              if (_this.x >= planebox.offsetWidth - _this.w) {
                _this.x = planebox.offsetWidth - _this.w;
              }
              _this.roleimg.style.left = _this.x + "px"; //赋值
            }, 1000 / 60);
          }

          document.addEventListener("keydown", function () {
            var ev = ev || window.event;
            if (ev.keyCode === 32) {
              clearInterval(uptimer); //防止事件下面的定时器叠加
              clearInterval(downtimer);
              clearInterval(lefttimer); //防止事件下面的定时器叠加
              clearInterval(righttimer); //防止上下键同时按。
              // clearInterval(shoottimer);
            }
          });
        }

        //松开按键停止运动
        document.addEventListener("keyup", function (ev) {
          var ev = ev || window.event;
          if (ev.keyCode === 87) {
            clearInterval(uptimer); //停止运动
          }
          if (ev.keyCode === 83) {
            clearInterval(downtimer); //停止运动
          }
          if (ev.keyCode === 65) {
            clearInterval(lefttimer); //停止运动
          }
          if (ev.keyCode === 68) {
            clearInterval(righttimer); //停止运动
          }
        });
      }
      myplaneShoot() {
        //我方飞机发射子弹
        let _this = this;
        let shoottimer = null; //定时器返回值
        document.addEventListener("keydown", shootbullet);
        let flag = true;

        function shootbullet(ev) {
          //事件处理函数
          var ev = ev || window.event;
          if (ev.keyCode === 75) {
            if (flag) {
              //限制keydown事件不断触发
              flag = false;

              function shoot() {
                new Bullet(
                  6,
                  14,
                  _this.x + _this.w / 2 - 3,
                  _this.y - 14,
                  require("./img/bullet.png")
                );
              }
              shoot();
              clearInterval(shoottimer); //防止定时器事件下面的叠加
              shoottimer = setInterval(shoot, 20); // 每隔20ms产生一个子弹
            }
          }
        }
        document.addEventListener("keyup", function () {
          var ev = ev || window.event;
          if (ev.keyCode === 75) {
            clearInterval(shoottimer);
            flag = true;
          }
        });

        document.addEventListener("keydown", function () {
          var ev = ev || window.event;
          if (ev.keyCode === 32) {
            // clearInterval(uptimer); //防止事件下面的定时器叠加
            // clearInterval(downtimer);
            // clearInterval(lefttimer); //防止事件下面的定时器叠加
            // clearInterval(righttimer); //防止上下键同时按。
            clearInterval(shoottimer);
          }
        });
      }
    }
    //6.敌方飞机类
    class Enemy extends Role {
      constructor(w, h, x, y, imgurl, boomurl, speed, blood, score) {
        super(w, h, x, y, imgurl, boomurl); //继承的
        this.speed = speed; //敌机的速度
        this.blood = blood; //敌机的血量
        this.score = score; //敌机的分数
        this.createRole(); //创建敌机角色
        this.enemyMove(); //敌机运动
        this.setattribute(); //给敌机设置自定义或者默认属性
      }
      setattribute() {
        //给敌机设置自定义或者默认属性
        let _this = this; //实例对象
        this.roleimg.className = "enemy";
        this.roleimg.blood = this.blood;
        this.roleimg.score = this.score;
        this.roleimg.checkblood = function () {
          //添加方法在敌机身上。

          if (this.blood === 0) {
            //敌机爆炸，消失。
            this.src = _this.boomurl;
            this.className = ""; //清除类名
            clearInterval(this.timer); //关闭敌机运动的定时器
            setTimeout(() => {
              //敌机延迟400ms消失
              planebox.removeChild(this);
            }, 400);
            //计算分数
            allscore += this.score; //分数累计
            score.innerHTML = allscore; //赋值分数
          }
        };
      }

      enemyMove() {
        //敌机运动
        this.roleimg.timer = setInterval(() => {
          //每一个敌机图片对象添加一个定时器
          this.y += this.speed; //添加速度
          if (this.y >= planebox.offsetHeight) {
            clearInterval(this.roleimg.timer);
            planebox.removeChild(this.roleimg);
          }
          this.enemyhit();
          this.roleimg.style.top = this.y + "px";
        }, 1000 / 60);
      }

      enemyhit() {
        //敌机碰撞我方飞机
        if (
          this.x + this.w >= ourplane.x &&
          this.x <= ourplane.x + ourplane.w &&
          this.y + this.h >= ourplane.y &&
          this.y <= ourplane.y + ourplane.h
        ) {
          const enemys = document.querySelectorAll(".enemy");
          for (let i = 0; i < enemys.length; i++) {
            enemys[i].className = "";
            clearInterval(enemys[i].timer);
          }
          ourplane.roleimg.src = ourplane.boomurl; //替换我方飞机的爆炸图片
          clearInterval(bgtimer);
          clearInterval(timer);
          setTimeout(() => {
            alert("game over");
            location.reload(true); //刷新页面
          }, 400);
        }
      }
    }
    //实例化随机产生敌机
    let timer = setInterval(() => {
      for (let i = 1; i <= ranNum(1, 3); i++) {
        //每秒钟产生1-3架敌机
        //随机产生1-20之间的数
        let num = ranNum(1, 20);
        if (num >= 1 && num < 15) {
          //小飞机
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
          //中飞机
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
          //大飞机
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
    // 按下空格暂停
    document.addEventListener("keydown", function () {
      var ev = ev || window.event;
      if (ev.keyCode === 32) {
        clearInterval(bgtimer);
        clearInterval(timer);
      }
    });

    let ourplane = new Myplane(
      66,
      80,
      (planebox.offsetWidth - 66) / 2,
      planebox.offsetHeight - 80,
      require("./img/myplane.gif"),
      require("./img/myplaneBoom.gif")
    );
  }, []);

  return (
    <div className="App">
      <div ref={myRef} className="planebox">
        <span>
          分数：<strong>0</strong>
        </span>
      </div>
    </div>
  );
};

export default App;
