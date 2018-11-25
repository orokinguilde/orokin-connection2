const { Canvas } = require('./Canvas');

function Banner(options)
{
    this.avatarUrl = options.avatarUrl;
    this.nickname = options.nickname;
    this.rankIndex = options.rankIndex;
    this.rankTotal = options.rankTotal;
    this.level = options.level;
    this.exp = options.exp;
    this.maxExp = options.maxExp;
    
    this.expVocal = options.expVocal;
    this.expText = options.expText;
}

Banner.prototype.createCanvas = function() {
    const ctx = new Canvas(500, 120, {
        serverUrl: process.env.CANVAS_URL
    });
    
    var nickname = this.nickname;
    var rank = this.rankIndex + 1;
    var rankTotal = this.rankTotal;
    var level = this.level;
    var exp = this.exp;
    var maxExp = this.maxExp;
    var progress = exp / maxExp;
    var expVocal = this.expVocal;
    var expText = this.expText;

    var bgLeftColor = '#f8faed';
    var bgRightColor = '#ebf4d7';
    var bgMiddleColor = '#fcfef1';
    var progressBar = {
        bgColor: bgMiddleColor,
        bgBorderColor: '#91af4b',
        foreColor: '#91af4b'
    };
    var nicknameColor = progressBar.foreColor;
    var expPanel = {
        leftColor: progressBar.foreColor,
        rightColor: '#569105'
    };
    var levelColor = progressBar.foreColor;
    var rankColor = progressBar.foreColor;
    var avatarAroundColor = progressBar.foreColor;

    const img = 'http://image.freepik.com/free-vector/green-energy-background_23-2147514943.jpg';
    const avatarImg = this.avatarUrl;
    const orokinImg = 'https://cdn.discordapp.com/avatars/441334363334901771/6588b637773c28a8e65eeb6c35a8ca32.png?size=128';
    
    ctx.fillStyle = bgLeftColor;
    roundRect(ctx, 0, 0, 500, 120, 20, true, false)
    ctx.fillStyle = bgRightColor;
    roundRect(ctx, 250, 0, 250, 120, 20, true, false)

    ctx.fillStyle = bgMiddleColor;
    var angle = 20*Math.PI/180;
    ctx.rotate(angle)
    roundRect(ctx, 240, -150, 45, 250, 0, true, false)
    ctx.fillStyle = bgLeftColor;
    roundRect(ctx, 245, -150, 5, 250, 0, true, false)
    roundRect(ctx, 255, -150, 5, 250, 0, true, false)

    ctx.fillStyle = bgRightColor;
    roundRect(ctx, 265, -150, 5, 250, 0, true, false)
    roundRect(ctx, 275, -150, 5, 250, 0, true, false)
    ctx.rotate(-angle)

    ctx.drawImage(img, 0, 0, 320, 250, 0, 0, 100, 100);
    ctx.drawImage(img, 390, 450, 230, 176, 400, 20, 100, 100);
    ctx.fillStyle = bgLeftColor;
    ctx.fillRect(55, 55, 45, 45);
    ctx.fillStyle = bgRightColor;
    ctx.fillRect(400, 20, 100, 3);
    ctx.fillRect(400, 20, 90, 8);
    ctx.fillRect(400, 20, 80, 15);
    ctx.fillRect(400, 20, 70, 24);
    ctx.fillRect(400, 20, 60, 32);
    ctx.fillRect(400, 20, 50, 42);
    ctx.fillRect(400, 20, 45, 45);
    ctx.fillRect(400, 30, 38, 50);
    ctx.fillRect(400, 30, 28, 60);
    ctx.fillRect(400, 30, 20, 70);
    ctx.fillRect(400, 30, 10, 80);

    ctx.fillStyle = bgMiddleColor;
    drawCircle(257.5, 60, 15);
    ctx.fillStyle = bgRightColor;
    drawCircle(257.5, 60, 10);
    ctx.fillStyle = bgMiddleColor;
    drawCircle(257.5, 60, 5);

    drawProgressBar(140, 80, 340, 20, progress);

    drawNickname(145, 63, nickname);
    drawExp(390, 63, exp, maxExp);

    drawLevel(310 + 100, 20, level)

    drawRank(210 + 100 - dix(rank) * 17, 20, rank);

    const offset = 7;

    if(avatarAroundColor)
    {
        ctx.fillStyle = avatarAroundColor;
        drawCircle(20 + 85/2, 20 + 85/2, 47);
        drawCircle(20 + 85 - 20 + 12 + offset, 20 + 85 - 20 + 12 + offset, 15);
        ctx.fillStyle = bgLeftColor;
        drawCircle(20 + 85 - 20 + 12 + offset + 2, 20 + 85 - 20 + 12 + offset + 2, 15 - 1);
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(20 + 85/2, 20 + 85/2, 43, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.clip()
    ctx.fillStyle = bgLeftColor;
    ctx.fillRect(0, 0, ctx.$options.width, ctx.$options.height);
    ctx.drawImage(avatarImg, 20, 20, 85, 85);
    ctx.restore();

    ctx.globalAlpha = 0.5;
    ctx.drawImage(orokinImg, 20 + 85 - 20 + offset + 1, 20 + 85 - 20 + offset + 1, 25, 25);
    //ctx.globalAlpha = 0.2;
    //ctx.drawImage(orokinImg, -10, -10, 200, 200);




    function drawNickname(x, y, nickname)
    {
        drawText(x, y, nickname, 20, nicknameColor);
    }

    function dix(value)
    {
        var d = 0;
        while(value >= 10)
        {
            ++d;
            value /= 10;
        }
        return d;
    }

    function drawExp(x, y, exp, maxExp)
    {
        exp = Math.trunc(exp);
        maxExp = maxExp;
        drawText(x, y, exp, 20, expPanel.leftColor);
        drawText(x + (dix(exp) + 1) * 11.5, y, '/' + Math.trunc(maxExp) + ' XP', 20, expPanel.rightColor);
    }

    function drawLevel(x, y, level)
    {
        drawText(x, y + 7, 'LEVEL', 15, levelColor);
        drawText(x + 47, y, Math.trunc(level), 30, levelColor);
    }

    function drawRank(x, y, rank)
    {
        drawText(x, y + 7, 'RANK', 15, rankColor);
        drawText(x + 47, y, '#' + Math.trunc(rank), 30, rankColor);
        drawText(x + 47, y + 3 + 20, '/' + Math.trunc(rankTotal), 15, rankColor);
    }

    function drawCircle(x, y, radius, stroke)
    {
        var radius = radius;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        if(stroke)
        {
            ctx.lineWidth = 5;
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
    }

    function drawText(x, y, text, fontSize, color)
    {
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = color;
        ctx.fillText(text, x, y + fontSize / 2);
    }

    function drawProgressBar(x, y, w, h, percent)
    {
        ctx.fillStyle = progressBar.bgBorderColor;
        roundRect(ctx, x - 1, y - 1, w + 2, h + 2, (h + 2) / 2, true, false);

        ctx.fillStyle = progressBar.bgColor;
        roundRect(ctx, x, y, w, h, h/2, true, false);

        ctx.fillStyle = progressBar.foreColor;
        var maxW = w;
        var wp = maxW * percent;

        if(percent >= 0.03)
        {
            var radiusRight = h/((maxW - wp));
            roundRect(ctx, x, y, wp, h, radiusRight >= h? h/2 : {
                tl: h/2,
                bl: h/2,
                tr: radiusRight,
                br: radiusRight
            }, true, false);
        }

        ctx.fillStyle = progressBar.bgColor;
        for(var i = 0; i < 22; ++i)
            drawCircle(x + 10 * (i + 1) + 5 * i, y + 10, 5);
            
        
        var xpVocal = Math.trunc(expVocal);
        ctx.drawImage('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQxMi4xMTMsMTcwLjc0N2MtNi42MzcsMC0xMi4wMiw1LjM4MS0xMi4wMiwxMi4wMnY3NS4xMDRjMCw3OS40NTItNjQuNjM5LDE0NC4wOS0xNDQuMDkyLDE0NC4wOSAgICBTMTExLjkxLDMzNy4zMjEsMTExLjkxLDI1Ny44N3YtNzUuMTA0YzAtNi42MzktNS4zODMtMTIuMDItMTIuMDItMTIuMDJjLTYuNjM5LDAtMTIuMDIsNS4zODEtMTIuMDIsMTIuMDJ2NzUuMTA0ICAgIGMwLDg4LjY2Niw2OC45OTMsMTYxLjUxMiwxNTYuMTExLDE2Ny42OTZ2NjIuMzk1aC02Mi4xNzRjLTYuNjM3LDAtMTIuMDIsNS4zODEtMTIuMDIsMTIuMDJjMCw2LjYzOSw1LjM4MiwxMi4wMiwxMi4wMiwxMi4wMiAgICBoMTQ4LjM4NmM2LjYzNywwLDEyLjAyLTUuMzgxLDEyLjAyLTEyLjAyYzAtNi42MzktNS4zODItMTIuMDItMTIuMDItMTIuMDJIMjY4LjAydi02Mi4zOTUgICAgYzg3LjExOS02LjE4NCwxNTYuMTExLTc5LjAzMSwxNTYuMTExLTE2Ny42OTZ2LTc1LjEwNEM0MjQuMTMzLDE3Ni4xMjgsNDE4Ljc1LDE3MC43NDcsNDEyLjExMywxNzAuNzQ3eiIgZmlsbD0iIzkxYWY0YiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI2NC4wMTEsMGgtMTYuMDJjLTU0Ljk0OSwwLTk5LjY1Myw0NC43MDQtOTkuNjUzLDk5LjY1M1YyNjUuODhjMCw1NC45NDksNDQuNzA0LDk5LjY1Myw5OS42NTMsOTkuNjUzaDE2LjAyICAgIGM1NC45NDksMCw5OS42NTMtNDQuNzA0LDk5LjY1My05OS42NTNWOTkuNjUzQzM2My42NjQsNDQuNzA0LDMxOC45NiwwLDI2NC4wMTEsMHogTTMzOS42MjUsMTMwLjg1M2gtNDMuNTcyICAgIGMtNi42MzksMC0xMi4wMiw1LjM4MS0xMi4wMiwxMi4wMmMwLDYuNjM5LDUuMzgxLDEyLjAyLDEyLjAyLDEyLjAyaDQzLjU3MnYzMy40NThoLTQzLjU3MmMtNi42MzksMC0xMi4wMiw1LjM4MS0xMi4wMiwxMi4wMiAgICBzNS4zODEsMTIuMDIsMTIuMDIsMTIuMDJoNDMuNTcydjMzLjQ2aC00My41NzJjLTYuNjM5LDAtMTIuMDIsNS4zODEtMTIuMDIsMTIuMDJzNS4zODEsMTIuMDIsMTIuMDIsMTIuMDJoNDMuNDY0ICAgIGMtMi4wOTEsMzkuODM2LTM1LjE1Nyw3MS42MDMtNzUuNTA1LDcxLjYwM2gtMTYuMDJjLTQwLjM0OCwwLTczLjQxNC0zMS43NjctNzUuNTA1LTcxLjYwM2g0My40NjQgICAgYzYuNjM5LDAsMTIuMDItNS4zODEsMTIuMDItMTIuMDJzLTUuMzgxLTEyLjAyLTEyLjAyLTEyLjAyaC00My41NzJ2LTMzLjQ2aDQzLjU3MmM2LjYzOSwwLDEyLjAyLTUuMzgxLDEyLjAyLTEyLjAyICAgIHMtNS4zODEtMTIuMDItMTIuMDItMTIuMDJoLTQzLjU3MnYtMzMuNDU4aDQzLjU3MmM2LjYzOSwwLDEyLjAyLTUuMzgxLDEyLjAyLTEyLjAyYzAtNi42MzktNS4zODEtMTIuMDItMTIuMDItMTIuMDJoLTQzLjU3MiAgICB2LTMxLjJjMC0yOS45NjQsMTcuNTItNTUuOTE0LDQyLjg1NC02OC4xNDN2MzMuOTgzYzAsNi42MzksNS4zODIsMTIuMDIsMTIuMDIsMTIuMDJzMTIuMDItNS4zODEsMTIuMDItMTIuMDJWMjQuNTU4ICAgIGMyLjg2My0wLjMzMSwzMC41OTUtMC4zMzEsMzMuNDU4LDB2NDAuOTM1YzAsNi42MzksNS4zODEsMTIuMDIsMTIuMDIsMTIuMDJjNi42MzcsMCwxMi4wMi01LjM4MSwxMi4wMi0xMi4wMlYzMS41MSAgICBjMjUuMzM0LDEyLjIyOSw0Mi44NTQsMzguMTc3LDQyLjg1NCw2OC4xNDJWMTMwLjg1M3oiIGZpbGw9IiM5MWFmNGIiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K', x + 5, y + h + 3, 15, 15);
        drawText(x + 20 + dix(xpVocal) - dix(1), y + h + 9, xpVocal + 'XP', 15, expPanel.leftColor);
        
        var offset = 70 + (dix(xpVocal) - 1) * 15;
        var xpText = Math.trunc(expText);
        ctx.drawImage('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDU0OC4xNzYgNTQ4LjE3NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTQ4LjE3NiA1NDguMTc2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUzNy40NjgsMTIwLjM0MmMtNy4xMzktNy4xMzktMTUuNzUzLTEwLjcwOS0yNS44NDEtMTAuNzA5SDM2LjU0NWMtMTAuMDg4LDAtMTguNjk5LDMuNTcxLTI1LjgzNywxMC43MDkgICAgQzMuNTcxLDEyNy40OCwwLDEzNi4wOTQsMCwxNDYuMTc5djI1NS44MTVjMCwxMC4wODksMy41NzEsMTguNjk4LDEwLjcwOCwyNS44MzdjNy4xMzksNy4xMzksMTUuNzQ5LDEwLjcxMiwyNS44MzcsMTAuNzEyaDQ3NS4wODIgICAgYzEwLjA4OCwwLDE4LjcwMi0zLjU3MywyNS44NDEtMTAuNzEyYzcuMTM1LTcuMTM5LDEwLjcwOC0xNS43NDgsMTAuNzA4LTI1LjgzN1YxNDYuMTc5ICAgIEM1NDguMTc2LDEzNi4wOTQsNTQ0LjYwMywxMjcuNDgsNTM3LjQ2OCwxMjAuMzQyeiBNNTExLjYyNyw0MDEuOTk0SDM2LjU0NVYxNDYuMTc5aDQ3NS4wODJWNDAxLjk5NHoiIGZpbGw9IiM5MWFmNGIiLz4KCQk8cGF0aCBkPSJNNzcuNjU3LDM2NS40NDVoMjcuNDA4YzMuMDQ2LDAsNC41NjktMS41MjYsNC41NjktNC41Njh2LTI3LjQwOGMwLTMuMDM5LTEuNTItNC41NjgtNC41NjktNC41NjhINzcuNjU3ICAgIGMtMy4wNDQsMC00LjU2OCwxLjUyOS00LjU2OCw0LjU2OHYyNy40MDhDNzMuMDg5LDM2My45MTksNzQuNjEzLDM2NS40NDUsNzcuNjU3LDM2NS40NDV6IiBmaWxsPSIjOTFhZjRiIi8+CgkJPHBhdGggZD0iTTc3LjY1NywyOTIuMzYyaDYzLjk1NGMzLjA0NSwwLDQuNTctMS41Myw0LjU3LTQuNTcydi0yNy40MWMwLTMuMDQ1LTEuNTI1LTQuNTY1LTQuNTctNC41NjhINzcuNjU3ICAgIGMtMy4wNDQsMC00LjU2OCwxLjUyMy00LjU2OCw0LjU2OHYyNy40MUM3My4wODksMjkwLjgzMiw3NC42MTMsMjkyLjM2Miw3Ny42NTcsMjkyLjM2MnoiIGZpbGw9IiM5MWFmNGIiLz4KCQk8cGF0aCBkPSJNNzcuNjU3LDIxOS4yNjhoMjcuNDA4YzMuMDQ2LDAsNC41NjktMS41MjUsNC41NjktNC41N3YtMjcuNDA2YzAtMy4wNDYtMS41Mi00LjU2NS00LjU2OS00LjU3SDc3LjY1NyAgICBjLTMuMDQ0LDAtNC41NjgsMS41MjQtNC41NjgsNC41N3YyNy40MDZDNzMuMDg5LDIxNy43NDMsNzQuNjEzLDIxOS4yNjgsNzcuNjU3LDIxOS4yNjh6IiBmaWxsPSIjOTFhZjRiIi8+CgkJPHBhdGggZD0iTTM5Ny40MywzMjguOTAzSDE1MC43NTFjLTMuMDQ2LDAtNC41NywxLjUyNi00LjU3LDQuNTcydjI3LjQwNGMwLDMuMDM5LDEuNTI0LDQuNTcyLDQuNTcsNC41NzJoMjQ2LjY3ICAgIGMzLjA0NiwwLDQuNTcyLTEuNTI2LDQuNTcyLTQuNTcydi0yNy40MDRDNDAxLjk5NCwzMzAuNDMsNDAwLjQ2OCwzMjguOTAzLDM5Ny40MywzMjguOTAzeiIgZmlsbD0iIzkxYWY0YiIvPgoJCTxwYXRoIGQ9Ik0xODIuNzI1LDI4Ny43OWMwLDMuMDQyLDEuNTIzLDQuNTcyLDQuNTY1LDQuNTcyaDI3LjQxMmMzLjA0NCwwLDQuNTY1LTEuNTMsNC41NjUtNC41NzJ2LTI3LjQxICAgIGMwLTMuMDQ1LTEuNTE4LTQuNTY1LTQuNTY1LTQuNTY4SDE4Ny4yOWMtMy4wNDIsMC00LjU2NSwxLjUyMy00LjU2NSw0LjU2OFYyODcuNzl6IiBmaWxsPSIjOTFhZjRiIi8+CgkJPHBhdGggZD0iTTE1MC43NTEsMjE5LjI2OGgyNy40MDZjMy4wNDYsMCw0LjU3LTEuNTI1LDQuNTctNC41N3YtMjcuNDA2YzAtMy4wNDYtMS41MjQtNC41NjUtNC41Ny00LjU3aC0yNy40MDYgICAgYy0zLjA0NiwwLTQuNTcsMS41MjQtNC41Nyw0LjU3djI3LjQwNkMxNDYuMTgxLDIxNy43NDMsMTQ3LjcwNiwyMTkuMjY4LDE1MC43NTEsMjE5LjI2OHoiIGZpbGw9IiM5MWFmNGIiLz4KCQk8cGF0aCBkPSJNMjU1LjgxMywyODcuNzljMCwzLjA0MiwxLjUyNCw0LjU3Miw0LjU2OCw0LjU3MmgyNy40MDhjMy4wNDYsMCw0LjU3Mi0xLjUzLDQuNTcyLTQuNTcydi0yNy40MSAgICBjMC0zLjA0NS0xLjUyNi00LjU2NS00LjU3Mi00LjU2OGgtMjcuNDA4Yy0zLjA0NCwwLTQuNTY4LDEuNTIzLTQuNTY4LDQuNTY4VjI4Ny43OXoiIGZpbGw9IiM5MWFmNGIiLz4KCQk8cGF0aCBkPSJNMjIzLjgzNywyMTkuMjY4aDI3LjQwNmMzLjA0NiwwLDQuNTctMS41MjUsNC41Ny00LjU3di0yNy40MDZjMC0zLjA0Ni0xLjUyMS00LjU2NS00LjU3LTQuNTdoLTI3LjQwNiAgICBjLTMuMDQ2LDAtNC41NywxLjUyNC00LjU3LDQuNTd2MjcuNDA2QzIxOS4yNjcsMjE3Ljc0MywyMjAuNzkxLDIxOS4yNjgsMjIzLjgzNywyMTkuMjY4eiIgZmlsbD0iIzkxYWY0YiIvPgoJCTxwYXRoIGQ9Ik0zMjguOTA0LDI4Ny43OWMwLDMuMDQyLDEuNTI1LDQuNTcyLDQuNTY0LDQuNTcyaDI3LjQxMmMzLjA0NSwwLDQuNTY0LTEuNTMsNC41NjQtNC41NzJ2LTI3LjQxICAgIGMwLTMuMDQ1LTEuNTItNC41NjUtNC41NjQtNC41NjhoLTI3LjQxMmMtMy4wMzksMC00LjU2NCwxLjUyMy00LjU2NCw0LjU2OFYyODcuNzl6IiBmaWxsPSIjOTFhZjRiIi8+CgkJPHBhdGggZD0iTTQ3MC41MTMsMzI4LjkwM2gtMjcuNDA0Yy0zLjA0NiwwLTQuNTcyLDEuNTI2LTQuNTcyLDQuNTcydjI3LjQwNGMwLDMuMDM5LDEuNTI2LDQuNTcyLDQuNTcyLDQuNTcyaDI3LjQwNCAgICBjMy4wNDYsMCw0LjU3Mi0xLjUyNiw0LjU3Mi00LjU3MnYtMjcuNDA0QzQ3NS4wODUsMzMwLjQzLDQ3My41NjIsMzI4LjkwMyw0NzAuNTEzLDMyOC45MDN6IiBmaWxsPSIjOTFhZjRiIi8+CgkJPHBhdGggZD0iTTI5Ni45MjgsMjE5LjI2OGgyNy40MTFjMy4wNDYsMCw0LjU2NS0xLjUyNSw0LjU2NS00LjU3di0yNy40MDZjMC0zLjA0Ni0xLjUyLTQuNTY1LTQuNTY1LTQuNTdoLTI3LjQxMSAgICBjLTMuMDQ2LDAtNC41NjUsMS41MjQtNC41NjUsNC41N3YyNy40MDZDMjkyLjM2MiwyMTcuNzQzLDI5My44ODIsMjE5LjI2OCwyOTYuOTI4LDIxOS4yNjh6IiBmaWxsPSIjOTFhZjRiIi8+CgkJPHBhdGggZD0iTTM3MC4wMTgsMjE5LjI2OGgyNy40MDRjMy4wNDYsMCw0LjU3Mi0xLjUyNSw0LjU3Mi00LjU3di0yNy40MDZjMC0zLjA0Ni0xLjUyNi00LjU2NS00LjU3Mi00LjU3aC0yNy40MDQgICAgYy0zLjA0NiwwLTQuNTcyLDEuNTI0LTQuNTcyLDQuNTd2MjcuNDA2QzM2NS40NDUsMjE3Ljc0MywzNjYuOTcyLDIxOS4yNjgsMzcwLjAxOCwyMTkuMjY4eiIgZmlsbD0iIzkxYWY0YiIvPgoJCTxwYXRoIGQ9Ik00MDEuOTkxLDI4Ny43OWMwLDMuMDQyLDEuNTIyLDQuNTcyLDQuNTY4LDQuNTcyaDYzLjk1M2MzLjA0NiwwLDQuNTcyLTEuNTMsNC41NzItNC41NzJWMTg3LjI5MiAgICBjMC0zLjA0Ni0xLjUyMi00LjU2NS00LjU3Mi00LjU3aC0yNy40MDRjLTMuMDQ2LDAtNC41NzIsMS41MjQtNC41NzIsNC41N3Y2OC41Mkg0MDYuNTZjLTMuMDQ2LDAtNC41NjgsMS41MjMtNC41NjgsNC41NjhWMjg3Ljc5eiAgICAiIGZpbGw9IiM5MWFmNGIiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K', x + 5 + offset, y + h + 3, 15, 15);
        drawText(x + offset + 25 + dix(xpText) - dix(1), y + h + 9, xpText + 'XP', 15, expPanel.leftColor);
    }


    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if(typeof stroke == 'undefined')
        {
            stroke = true;
        }
        if(typeof radius === 'undefined')
        {
            radius = 5;
        }
        if(typeof radius === 'number')
        {
            radius = {
                tl: radius,
                tr: radius,
                br: radius,
                bl: radius
            };
        }
        else
        {
            var defaultRadius = {
                tl: 0,
                tr: 0,
                br: 0,
                bl: 0
            };

            for(var side in defaultRadius)
            {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }

        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();

        if(fill)
        {
            ctx.fill();
        }
        if(stroke)
        {
            ctx.stroke();
        }
    }

    return ctx;
}

Banner.prototype.createBuffer = function(callback) {
    const ctx = this.createCanvas();
    ctx.toBuffer(callback);
}

Banner.prototype.createStream = function(callback) {
    const ctx = this.createCanvas();
    ctx.toStream(callback);
}

module.exports = Banner;
