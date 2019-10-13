(function() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var game = new Game();

    function Game() {
        this.isValid = true;
        this.realwidth;
        this.realheight;
        this.width = 1000;
        this.height = 1000;
        this.player = new Player(500,500,20,20,5,0.8,'#FFFFFF');
        this.boxes = [];
        this.things = [];
        this.sites = ['https://naver.com',
                    'https://google.com',
                    'https://stackoverflow.com',
                    'https://surviv.io',
                    'https://mit-games.kr/wordpress',
                    'https://mit-games.kr/mediawiki',
                    'https://namu.wiki',
                    'https://www.youtube.com',
                    'https://daum.net',
                    'https://facebook.com',
                    'https://dcinside.com',
                    'https://portal.changwon.ac.kr',
                    'https://coupang.com',
                    'https://ruliweb.com',
                    'http://www.thisisgame.com/webzine/series/nboard/213/?series=42&page=1&n=47774',
                    'https://heroesofthestorm.com/ko-kr/?',
                    'https://www.casper.or.kr/xe/'];
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseSense = 12;
    }
    Game.prototype = {
        Init : function () {
            //not yet
            this.realwidth = window.innerWidth;
            this.realheight = window.innerHeight;
            this.width = this.realwidth;
            this.height = this.realheight;
            // if (this.realwidth > this.realheight) {
            //     this.height = 1000;
            //     this.width = this.realwidth * (this.height / this.realheight);
            // } else {
            //     this.width = 1000;
            //     this.height = this.realheight * (this.width / this.realwidth);
            // }
            canvas.width = this.realwidth;
            canvas.height = this.realheight;
            this.boxes = [];
            this.things = [];
            this.isDragging = false;
            this.startX = 0;
            this.startY = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseSense = 12;
            this.player = new Player(this.width / 2, this.height / 2, 20,20,20,0.98,'#E6AC27');
            this.boxes.push(new Box(this.width / 2, 0, this.width, 20, '#655643'));
            this.boxes.push(new Box(this.width / 2, this.height, this.width, 20,'#655643'));
            this.boxes.push(new Box(0,this.height / 2, 20, this.height,'#655643'));
            this.boxes.push(new Box(this.width, this.height / 2, 20, this.height,'#655643'));
            if(this.width > this.height) {
                this.boxes.push(new Box(this.width * 3 / 10, this.height / 2, 20, 60,'#655643'));
                this.boxes.push(new Box(this.width * 7 / 10, this.height / 2, 20, 60,'#655643'));
                this.things.push(new Thing(this.width * 1 / 10,this.height / 2,20,20,0,0,'#2A5D77','home'));
                this.things.push(new Thing(this.width * 9 / 10,this.height / 2,20,20,0,0,'#2A5D77','wiki'));
            } else {
                this.boxes.push(new Box(this.width / 2, this.height * 3 / 10, 60, 20,'#655643'));
                this.boxes.push(new Box(this.width / 2, this.height * 7 / 10, 60, 20,'#655643'));
                this.things.push(new Thing(this.width / 2,this.height * 1 / 10,20,20,0,0,'#2A5D77','home'));
                this.things.push(new Thing(this.width / 2,this.height * 9 / 10,20,20,0,0,'#2A5D77','wiki'));
            }
            var den = 120;
            for (var i = 0; i * den + den / 2 < this.width; ++i) {
                for (var j = 0; j * den + den / 2 < this.height; ++j) {
                    if(Math.abs(this.player.x - i*den - den/2) < 30 || Math.abs(this.player.y - j*den - den/2) < 30) {
                        continue;
                    }
                    if((i+j)%2 == 0) {
                        // if((i+j)%4 == 0) {
                        //     this.things.push(new Thing(i*den,j*den, 20, 20, 0,1,'#e8461a'));
                        // } else {
                        //     this.things.push(new Thing(i*den,j*den, 20, 20, 0,-1,'#e8461a'));
                        // }
                        if(Math.random() - 0.5 < 0) {
                            this.things.push(new Thing(i*den + den/2, j*den + den/2, 20, 20, 0, -1,'#e8461a', 'trap'));
                        } else {
                            this.things.push(new Thing(i*den + den/2, j*den + den/2, 20, 20, 0, 1,'#e8461a', 'trap'));
                        }

                    } else {
                        // if((i+j)%4 == 3) {
                        //     this.things.push(new Thing(i*den,j*den, 20, 20, 1,0,'#e8461a'));
                        // } else {
                        //     this.things.push(new Thing(i*den,j*den, 20, 20, -1,0,'#e8461a'));
                        // }
                        if(Math.random() - 0.5 < 0) {
                            this.things.push(new Thing(i*den + den/2, j*den + den/2, 20, 20, -1, 0,'#e8461a', 'trap'));
                        } else {
                            this.things.push(new Thing(i*den + den/2, j*den + den/2, 20, 20, 1, 0,'#e8461a', 'trap'));
                        }

                    }

                }
            }

            //Initiating
            this.player.Init();

            this.isValid = true;
        },
        Update : function () {
            //input not yet
            this.things.forEach(function(thing){
                game.boxes.forEach(function(box){
                    var dir = colCheck(thing, box);
                    if (dir == "l" || dir == "r") {
                        thing.vel.x *= -1;
                    } else if (dir == "t" || dir == "b") {
                        thing.vel.y *= -1;
                    }
                });
            });
            this.things.forEach(function(thing){
                var dir = colCheck(thing, game.player);
                if (dir && thing.isValid) {
                    thing.React();
                    thing.isValid = false;
                }
            });
            this.boxes.forEach(function(box){
                var dir = colCheck(game.player, box);
                if (dir == "l" || dir == "r") {
                    game.player.vel.x *= -1;
                } else if (dir == "t" || dir == "b") {
                    game.player.vel.y *= -1;
                }
            });

            this.player.Update();
            this.things.forEach(function(thing){
                thing.Update();
            });
        },
        Draw : function () {

            ctx.clearRect(0, 0, this.realwidth, this.realheight);
            // ctx.fillStyle = '#80BCA3';
            // ctx.fillRect(0, 0, this.realwidth, this.realheight);
            ctx.font = '18pt Calibri';
            ctx.fillStyle = 'black';
            ctx.fillText('mouse : ' + this.mouseX + ',' + this.mouseY, 10, 25);

            if(this.isDragging) {
                ctx.beginPath();
                ctx.arc(this.startX, this.startY, 20, 0, Math.PI * 2);
                ctx.fillStyle = "rgba( 255, 0, 0, 0.5)";
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(this.player.x, this.player.y);
                var x = (this.startX - this.mouseX)/this.mouseSense;
                var y = (this.startY - this.mouseY)/this.mouseSense;
                var scale = Math.sqrt(x * x + y * y);
                if (this.player.speed < scale) {
                    ctx.lineTo(this.player.x + (this.startX - this.mouseX) * (this.player.speed/scale), this.player.y + (this.startY - this.mouseY) * (this.player.speed/scale));
                } else {
                    ctx.lineTo(this.player.x + this.startX - this.mouseX, this.player.y + this.startY - this.mouseY);
                }
                ctx.stroke();
            }

            this.boxes.forEach(function(box){
                box.Draw();
            });
            this.things.forEach(function(thing){
                thing.Draw();
            });
            this.player.Draw();
        },
        Loop : function () {
            if(game.isValid) {
                game.Update();
                game.Draw();
            }
            requestAnimationFrame(game.Loop);
        }
    };
    function Player(x, y, w, h, s, f, c) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.speed = s;
        this.vel = {x : 0, y : 0};
        this.friction = f;
        this.color = c;
        this.tails = [];
        this.tailLength = 20;
    }
    Player.prototype = {
        Init : function () {
            for(var i = 0; i < this.tailLength; ++i) {
                this.tails.push({x:this.x, y:this.y});
            }
        },
        AddForce : function(x, y) {
            this.vel.x = x;
            this.vel.y = y;
            // max not yet
            var scale = Math.sqrt(x * x + y * y);
            if (this.speed < scale) {
                this.vel.x *= (this.speed/scale);
                this.vel.y *= (this.speed/scale);
            }
        },
        Update : function () {
            this.tails.shift();
            this.tails.push({x:this.x, y:this.y});

            this.vel.x *= this.friction;
            this.vel.y *= this.friction;
            this.x += this.vel.x;
            this.y += this.vel.y;


        },
        Draw : function () {
            for(var i = this.tailLength - 1; i >= 0; --i) {
                var lerp = i / this.tailLength;
                ctx.fillStyle = "rgba(255, 165, 0, " + lerp + ")";
                ctx.fillRect(this.tails[i].x - this.width * lerp / 2, this.tails[i].y - this.height * lerp / 2, this.width * lerp, this.height * lerp);
            }
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.width / 2 , this.y - this.height / 2, this.width, this.height);
        }
    };
    function Box(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = c;
    }
    Box.prototype = {
        Init : function () {/* done */},
        Update : function () {/* done */},
        Draw : function () {
            ctx.fillStyle = this.color;
            var ratioX = game.realwidth / game.width;
            var ratioY = game.realheight / game.height;
            ctx.fillRect((this.x - this.width / 2) * ratioX, (this.y - this.height / 2) * ratioY, this.width * ratioX, this.height * ratioY);
        }
    };
    function Thing(x, y, w, h, vx, vy, c, t) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.vel = {x : vx, y : vy};
        this.isValid = true;
        this.color = c;
        this.type = t;
    }
    Thing.prototype = {
        Init : function () { this.isValid = true; },
        Update : function () {
            if(this.isValid) {
                this.x += this.vel.x;
                this.y += this.vel.y;
            }
        },
        Draw : function () {
            if(this.isValid){
                ctx.fillStyle = this.color;
                var ratioX = game.realwidth / game.width;
                var ratioY = game.realheight / game.height;
                ctx.fillRect((this.x - this.width / 2) * ratioX, (this.y - this.height / 2) * ratioY, this.width * ratioX, this.height * ratioY);
            }
        },
        React : function () {
            if(this.isValid) {
                this.isValid = false;
                switch (this.type) {
                    case "wiki":
                        window.location = 'https://mit-games.kr/mediawiki';
                        game.isValid = false;
                        break;
                    case "home":
                        window.location = 'https://mit-games.kr/wordpress';
                        game.isValid = false;
                        break;
                    case "trap":
                        window.location = game.sites[Math.floor(Math.random() * game.sites.length)];
                        game.isValid = false;
                        break;
                    default:
                        break;
                }
            }
        }
    };

    function colCheck(shapeA, shapeB) {
        // get the vectors to check against
        var vX = (shapeA.x) - (shapeB.x),
            vY = (shapeA.y) - (shapeB.y),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    colDir = "t";
                    shapeA.y += oY;
                } else {
                    colDir = "b";
                    shapeA.y -= oY;
                }
            } else {
                if (vX > 0) {
                    colDir = "l";
                    shapeA.x += oX;
                } else {
                    colDir = "r";
                    shapeA.x -= oX;
                }
            }
        }
        return colDir;
    }

    window.addEventListener('resize', function() {
        game.Init();
    });
    window.addEventListener("load", function () {
        game.Init();
        game.Loop();
    });
    window.addEventListener("mousemove", function (e) {
        game.mouseX = e.clientX
        game.mouseY = e.clientY;
    })
    window.addEventListener("mousedown", function (e) {
        if(!game.isDragging)
        {
            game.startX = e.clientX
            game.startY = e.clientY;
            game.isDragging = true;
        }
    })
    window.addEventListener("mouseup", function (e) {
        if(game.isDragging)
        {
            game.player.AddForce((game.startX - game.mouseX) / game.mouseSense, (game.startY - game.mouseY) / game.mouseSense);
            game.isDragging = false;
        }
    })
    window.addEventListener("touchmove", function (e) {
        var touch = e.targetTouches[0];
        game.mouseX = touch.pageX
        game.mouseY = touch.pageY;
    })
    window.addEventListener("touchstart", function (e) {
        if(!game.isDragging)
        {
            var touch = e.targetTouches[0];
            game.startX = touch.pageX
            game.startY = touch.pageY;
            game.isDragging = true;
        }
    })
    window.addEventListener("touchend", function (e) {
        if(game.isDragging)
        {
            game.player.AddForce((game.startX - game.mouseX) / game.mouseSense, (game.startY - game.mouseY) / game.mouseSense);
            game.isDragging = false;
        }
    })

})();
