//const { Canvas } = require('./Canvas');
const Canvas = require('canvas');

function Banner(options)
{
    this.avatarUrl = options.avatarUrl;
    this.nickname = options.nickname;
    this.rankIndex = options.rankIndex;
    this.rankTotal = options.rankTotal;
    this.level = options.level;
    this.exp = options.exp;
    this.maxExp = options.maxExp;
    this.levelName = options.levelName;
    
    this.expVocal = options.expVocal;
    this.expText = options.expText;
}

Banner.prototype.createCanvas = function(template, callback) {
    var isDarkColor = template.template.isDarkColor;
    var isDarkBg = template.template.isDarkBg;

    const width = 550;
    const height = 140;

    /*const ctx = new Canvas(width, height, {
        serverUrl: process.env.CANVAS_URL
    });*/
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.$options = {
        width: width,
        height: height
    };
    
    var nickname = this.nickname;
    var rank = this.rankIndex + 1;
    var rankTotal = this.rankTotal;
    var level = this.level;
    var exp = this.exp;
    var maxExp = this.maxExp;
    var progress = exp / maxExp;
    var expVocal = this.expVocal;
    var expText = this.expText;
    var levelName = this.levelName;

    function greenTheme()
    {
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

        return {
            bgLeftColor: bgLeftColor,
            bgRightColor: bgRightColor,
            progressBar: progressBar,
            nicknameColor: nicknameColor,
            expPanel: expPanel,
            levelColor: levelColor,
            rankColor: rankColor,
            avatarAroundColor: avatarAroundColor
        }
    }

    function darkTheme()
    {
        var bgLeftColor = '#f8faed';
        var bgRightColor = '#ebf4d7';
        var bgMiddleColor = '#42464d';
        var progressBar = {
            bgColor: bgMiddleColor,
            bgBorderColor: '#848c9a',
            foreColor: '#848c9a'
        };
        var nicknameColor = progressBar.foreColor;
        var expPanel = {
            leftColor: progressBar.foreColor,
            rightColor: '#717782'
        };
        var levelColor = progressBar.foreColor;
        var rankColor = progressBar.foreColor;
        var avatarAroundColor = progressBar.foreColor;

        return {
            bgLeftColor: bgLeftColor,
            bgRightColor: bgRightColor,
            bgMiddleColor: bgMiddleColor,
            progressBar: progressBar,
            nicknameColor: nicknameColor,
            expPanel: expPanel,
            levelColor: levelColor,
            rankColor: rankColor,
            avatarAroundColor: avatarAroundColor
        }
    }

    function replaceColor(base64Str, color)
    {
        const str = Buffer.from(base64Str, 'base64').toString();
        return Buffer.from(str.replace(/\{\{\s*color\s*\}\}/img, color)).toString('base64');
    }

    const {
        bgLeftColor,
        bgRightColor,
        bgMiddleColor,
        progressBar,
        nicknameColor,
        expPanel,
        levelColor,
        rankColor,
        avatarAroundColor
    } = isDarkColor ? darkTheme() : greenTheme();

    let img = 'http://image.freepik.com/free-vector/green-energy-background_23-2147514943.jpg';
    let avatarImg = this.avatarUrl;
    let orokinImg = 'https://cdn.discordapp.com/attachments/514178068835860498/718529978018562089/473257182591451147.png?size=128';
    let blackBg = 'https://cdn.discordapp.com/attachments/514172417174798341/516346545335959565/Sans_titre123.png';
    let iconXpVocal = 'data:image/svg+xml;utf8;base64,' + replaceColor('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQxMi4xMTMsMTcwLjc0N2MtNi42MzcsMC0xMi4wMiw1LjM4MS0xMi4wMiwxMi4wMnY3NS4xMDRjMCw3OS40NTItNjQuNjM5LDE0NC4wOS0xNDQuMDkyLDE0NC4wOSAgICBTMTExLjkxLDMzNy4zMjEsMTExLjkxLDI1Ny44N3YtNzUuMTA0YzAtNi42MzktNS4zODMtMTIuMDItMTIuMDItMTIuMDJjLTYuNjM5LDAtMTIuMDIsNS4zODEtMTIuMDIsMTIuMDJ2NzUuMTA0ICAgIGMwLDg4LjY2Niw2OC45OTMsMTYxLjUxMiwxNTYuMTExLDE2Ny42OTZ2NjIuMzk1aC02Mi4xNzRjLTYuNjM3LDAtMTIuMDIsNS4zODEtMTIuMDIsMTIuMDJjMCw2LjYzOSw1LjM4MiwxMi4wMiwxMi4wMiwxMi4wMiAgICBoMTQ4LjM4NmM2LjYzNywwLDEyLjAyLTUuMzgxLDEyLjAyLTEyLjAyYzAtNi42MzktNS4zODItMTIuMDItMTIuMDItMTIuMDJIMjY4LjAydi02Mi4zOTUgICAgYzg3LjExOS02LjE4NCwxNTYuMTExLTc5LjAzMSwxNTYuMTExLTE2Ny42OTZ2LTc1LjEwNEM0MjQuMTMzLDE3Ni4xMjgsNDE4Ljc1LDE3MC43NDcsNDEyLjExMywxNzAuNzQ3eiIgZmlsbD0ie3tjb2xvcn19Ii8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMjY0LjAxMSwwaC0xNi4wMmMtNTQuOTQ5LDAtOTkuNjUzLDQ0LjcwNC05OS42NTMsOTkuNjUzVjI2NS44OGMwLDU0Ljk0OSw0NC43MDQsOTkuNjUzLDk5LjY1Myw5OS42NTNoMTYuMDIgICAgYzU0Ljk0OSwwLDk5LjY1My00NC43MDQsOTkuNjUzLTk5LjY1M1Y5OS42NTNDMzYzLjY2NCw0NC43MDQsMzE4Ljk2LDAsMjY0LjAxMSwweiBNMzM5LjYyNSwxMzAuODUzaC00My41NzIgICAgYy02LjYzOSwwLTEyLjAyLDUuMzgxLTEyLjAyLDEyLjAyYzAsNi42MzksNS4zODEsMTIuMDIsMTIuMDIsMTIuMDJoNDMuNTcydjMzLjQ1OGgtNDMuNTcyYy02LjYzOSwwLTEyLjAyLDUuMzgxLTEyLjAyLDEyLjAyICAgIHM1LjM4MSwxMi4wMiwxMi4wMiwxMi4wMmg0My41NzJ2MzMuNDZoLTQzLjU3MmMtNi42MzksMC0xMi4wMiw1LjM4MS0xMi4wMiwxMi4wMnM1LjM4MSwxMi4wMiwxMi4wMiwxMi4wMmg0My40NjQgICAgYy0yLjA5MSwzOS44MzYtMzUuMTU3LDcxLjYwMy03NS41MDUsNzEuNjAzaC0xNi4wMmMtNDAuMzQ4LDAtNzMuNDE0LTMxLjc2Ny03NS41MDUtNzEuNjAzaDQzLjQ2NCAgICBjNi42MzksMCwxMi4wMi01LjM4MSwxMi4wMi0xMi4wMnMtNS4zODEtMTIuMDItMTIuMDItMTIuMDJoLTQzLjU3MnYtMzMuNDZoNDMuNTcyYzYuNjM5LDAsMTIuMDItNS4zODEsMTIuMDItMTIuMDIgICAgcy01LjM4MS0xMi4wMi0xMi4wMi0xMi4wMmgtNDMuNTcydi0zMy40NThoNDMuNTcyYzYuNjM5LDAsMTIuMDItNS4zODEsMTIuMDItMTIuMDJjMC02LjYzOS01LjM4MS0xMi4wMi0xMi4wMi0xMi4wMmgtNDMuNTcyICAgIHYtMzEuMmMwLTI5Ljk2NCwxNy41Mi01NS45MTQsNDIuODU0LTY4LjE0M3YzMy45ODNjMCw2LjYzOSw1LjM4MiwxMi4wMiwxMi4wMiwxMi4wMnMxMi4wMi01LjM4MSwxMi4wMi0xMi4wMlYyNC41NTggICAgYzIuODYzLTAuMzMxLDMwLjU5NS0wLjMzMSwzMy40NTgsMHY0MC45MzVjMCw2LjYzOSw1LjM4MSwxMi4wMiwxMi4wMiwxMi4wMmM2LjYzNywwLDEyLjAyLTUuMzgxLDEyLjAyLTEyLjAyVjMxLjUxICAgIGMyNS4zMzQsMTIuMjI5LDQyLjg1NCwzOC4xNzcsNDIuODU0LDY4LjE0MlYxMzAuODUzeiIgZmlsbD0ie3tjb2xvcn19Ii8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+', expPanel.leftColor);
    let iconXpText = 'data:image/svg+xml;utf8;base64,' + replaceColor('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDU0OC4xNzYgNTQ4LjE3NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTQ4LjE3NiA1NDguMTc2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUzNy40NjgsMTIwLjM0MmMtNy4xMzktNy4xMzktMTUuNzUzLTEwLjcwOS0yNS44NDEtMTAuNzA5SDM2LjU0NWMtMTAuMDg4LDAtMTguNjk5LDMuNTcxLTI1LjgzNywxMC43MDkgICAgQzMuNTcxLDEyNy40OCwwLDEzNi4wOTQsMCwxNDYuMTc5djI1NS44MTVjMCwxMC4wODksMy41NzEsMTguNjk4LDEwLjcwOCwyNS44MzdjNy4xMzksNy4xMzksMTUuNzQ5LDEwLjcxMiwyNS44MzcsMTAuNzEyaDQ3NS4wODIgICAgYzEwLjA4OCwwLDE4LjcwMi0zLjU3MywyNS44NDEtMTAuNzEyYzcuMTM1LTcuMTM5LDEwLjcwOC0xNS43NDgsMTAuNzA4LTI1LjgzN1YxNDYuMTc5ICAgIEM1NDguMTc2LDEzNi4wOTQsNTQ0LjYwMywxMjcuNDgsNTM3LjQ2OCwxMjAuMzQyeiBNNTExLjYyNyw0MDEuOTk0SDM2LjU0NVYxNDYuMTc5aDQ3NS4wODJWNDAxLjk5NHoiIGZpbGw9Int7Y29sb3J9fSIvPgoJCTxwYXRoIGQ9Ik03Ny42NTcsMzY1LjQ0NWgyNy40MDhjMy4wNDYsMCw0LjU2OS0xLjUyNiw0LjU2OS00LjU2OHYtMjcuNDA4YzAtMy4wMzktMS41Mi00LjU2OC00LjU2OS00LjU2OEg3Ny42NTcgICAgYy0zLjA0NCwwLTQuNTY4LDEuNTI5LTQuNTY4LDQuNTY4djI3LjQwOEM3My4wODksMzYzLjkxOSw3NC42MTMsMzY1LjQ0NSw3Ny42NTcsMzY1LjQ0NXoiIGZpbGw9Int7Y29sb3J9fSIvPgoJCTxwYXRoIGQ9Ik03Ny42NTcsMjkyLjM2Mmg2My45NTRjMy4wNDUsMCw0LjU3LTEuNTMsNC41Ny00LjU3MnYtMjcuNDFjMC0zLjA0NS0xLjUyNS00LjU2NS00LjU3LTQuNTY4SDc3LjY1NyAgICBjLTMuMDQ0LDAtNC41NjgsMS41MjMtNC41NjgsNC41Njh2MjcuNDFDNzMuMDg5LDI5MC44MzIsNzQuNjEzLDI5Mi4zNjIsNzcuNjU3LDI5Mi4zNjJ6IiBmaWxsPSJ7e2NvbG9yfX0iLz4KCQk8cGF0aCBkPSJNNzcuNjU3LDIxOS4yNjhoMjcuNDA4YzMuMDQ2LDAsNC41NjktMS41MjUsNC41NjktNC41N3YtMjcuNDA2YzAtMy4wNDYtMS41Mi00LjU2NS00LjU2OS00LjU3SDc3LjY1NyAgICBjLTMuMDQ0LDAtNC41NjgsMS41MjQtNC41NjgsNC41N3YyNy40MDZDNzMuMDg5LDIxNy43NDMsNzQuNjEzLDIxOS4yNjgsNzcuNjU3LDIxOS4yNjh6IiBmaWxsPSJ7e2NvbG9yfX0iLz4KCQk8cGF0aCBkPSJNMzk3LjQzLDMyOC45MDNIMTUwLjc1MWMtMy4wNDYsMC00LjU3LDEuNTI2LTQuNTcsNC41NzJ2MjcuNDA0YzAsMy4wMzksMS41MjQsNC41NzIsNC41Nyw0LjU3MmgyNDYuNjcgICAgYzMuMDQ2LDAsNC41NzItMS41MjYsNC41NzItNC41NzJ2LTI3LjQwNEM0MDEuOTk0LDMzMC40Myw0MDAuNDY4LDMyOC45MDMsMzk3LjQzLDMyOC45MDN6IiBmaWxsPSJ7e2NvbG9yfX0iLz4KCQk8cGF0aCBkPSJNMTgyLjcyNSwyODcuNzljMCwzLjA0MiwxLjUyMyw0LjU3Miw0LjU2NSw0LjU3MmgyNy40MTJjMy4wNDQsMCw0LjU2NS0xLjUzLDQuNTY1LTQuNTcydi0yNy40MSAgICBjMC0zLjA0NS0xLjUxOC00LjU2NS00LjU2NS00LjU2OEgxODcuMjljLTMuMDQyLDAtNC41NjUsMS41MjMtNC41NjUsNC41NjhWMjg3Ljc5eiIgZmlsbD0ie3tjb2xvcn19Ii8+CgkJPHBhdGggZD0iTTE1MC43NTEsMjE5LjI2OGgyNy40MDZjMy4wNDYsMCw0LjU3LTEuNTI1LDQuNTctNC41N3YtMjcuNDA2YzAtMy4wNDYtMS41MjQtNC41NjUtNC41Ny00LjU3aC0yNy40MDYgICAgYy0zLjA0NiwwLTQuNTcsMS41MjQtNC41Nyw0LjU3djI3LjQwNkMxNDYuMTgxLDIxNy43NDMsMTQ3LjcwNiwyMTkuMjY4LDE1MC43NTEsMjE5LjI2OHoiIGZpbGw9Int7Y29sb3J9fSIvPgoJCTxwYXRoIGQ9Ik0yNTUuODEzLDI4Ny43OWMwLDMuMDQyLDEuNTI0LDQuNTcyLDQuNTY4LDQuNTcyaDI3LjQwOGMzLjA0NiwwLDQuNTcyLTEuNTMsNC41NzItNC41NzJ2LTI3LjQxICAgIGMwLTMuMDQ1LTEuNTI2LTQuNTY1LTQuNTcyLTQuNTY4aC0yNy40MDhjLTMuMDQ0LDAtNC41NjgsMS41MjMtNC41NjgsNC41NjhWMjg3Ljc5eiIgZmlsbD0ie3tjb2xvcn19Ii8+CgkJPHBhdGggZD0iTTIyMy44MzcsMjE5LjI2OGgyNy40MDZjMy4wNDYsMCw0LjU3LTEuNTI1LDQuNTctNC41N3YtMjcuNDA2YzAtMy4wNDYtMS41MjEtNC41NjUtNC41Ny00LjU3aC0yNy40MDYgICAgYy0zLjA0NiwwLTQuNTcsMS41MjQtNC41Nyw0LjU3djI3LjQwNkMyMTkuMjY3LDIxNy43NDMsMjIwLjc5MSwyMTkuMjY4LDIyMy44MzcsMjE5LjI2OHoiIGZpbGw9Int7Y29sb3J9fSIvPgoJCTxwYXRoIGQ9Ik0zMjguOTA0LDI4Ny43OWMwLDMuMDQyLDEuNTI1LDQuNTcyLDQuNTY0LDQuNTcyaDI3LjQxMmMzLjA0NSwwLDQuNTY0LTEuNTMsNC41NjQtNC41NzJ2LTI3LjQxICAgIGMwLTMuMDQ1LTEuNTItNC41NjUtNC41NjQtNC41NjhoLTI3LjQxMmMtMy4wMzksMC00LjU2NCwxLjUyMy00LjU2NCw0LjU2OFYyODcuNzl6IiBmaWxsPSJ7e2NvbG9yfX0iLz4KCQk8cGF0aCBkPSJNNDcwLjUxMywzMjguOTAzaC0yNy40MDRjLTMuMDQ2LDAtNC41NzIsMS41MjYtNC41NzIsNC41NzJ2MjcuNDA0YzAsMy4wMzksMS41MjYsNC41NzIsNC41NzIsNC41NzJoMjcuNDA0ICAgIGMzLjA0NiwwLDQuNTcyLTEuNTI2LDQuNTcyLTQuNTcydi0yNy40MDRDNDc1LjA4NSwzMzAuNDMsNDczLjU2MiwzMjguOTAzLDQ3MC41MTMsMzI4LjkwM3oiIGZpbGw9Int7Y29sb3J9fSIvPgoJCTxwYXRoIGQ9Ik0yOTYuOTI4LDIxOS4yNjhoMjcuNDExYzMuMDQ2LDAsNC41NjUtMS41MjUsNC41NjUtNC41N3YtMjcuNDA2YzAtMy4wNDYtMS41Mi00LjU2NS00LjU2NS00LjU3aC0yNy40MTEgICAgYy0zLjA0NiwwLTQuNTY1LDEuNTI0LTQuNTY1LDQuNTd2MjcuNDA2QzI5Mi4zNjIsMjE3Ljc0MywyOTMuODgyLDIxOS4yNjgsMjk2LjkyOCwyMTkuMjY4eiIgZmlsbD0ie3tjb2xvcn19Ii8+CgkJPHBhdGggZD0iTTM3MC4wMTgsMjE5LjI2OGgyNy40MDRjMy4wNDYsMCw0LjU3Mi0xLjUyNSw0LjU3Mi00LjU3di0yNy40MDZjMC0zLjA0Ni0xLjUyNi00LjU2NS00LjU3Mi00LjU3aC0yNy40MDQgICAgYy0zLjA0NiwwLTQuNTcyLDEuNTI0LTQuNTcyLDQuNTd2MjcuNDA2QzM2NS40NDUsMjE3Ljc0MywzNjYuOTcyLDIxOS4yNjgsMzcwLjAxOCwyMTkuMjY4eiIgZmlsbD0ie3tjb2xvcn19Ii8+CgkJPHBhdGggZD0iTTQwMS45OTEsMjg3Ljc5YzAsMy4wNDIsMS41MjIsNC41NzIsNC41NjgsNC41NzJoNjMuOTUzYzMuMDQ2LDAsNC41NzItMS41Myw0LjU3Mi00LjU3MlYxODcuMjkyICAgIGMwLTMuMDQ2LTEuNTIyLTQuNTY1LTQuNTcyLTQuNTdoLTI3LjQwNGMtMy4wNDYsMC00LjU3MiwxLjUyNC00LjU3Miw0LjU3djY4LjUySDQwNi41NmMtMy4wNDYsMC00LjU2OCwxLjUyMy00LjU2OCw0LjU2OFYyODcuNzl6ICAgICIgZmlsbD0ie3tjb2xvcn19Ii8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+', expPanel.leftColor);
    let iconLevelName = 'data:image/svg+xml;utf8;base64,' + replaceColor('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI5Ny4zMzQgMjk3LjMzNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk3LjMzNCAyOTcuMzM0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+CjxnPgoJPHBhdGggZD0iTTI1NS41LDBoLTIxM2MtNC40MTgsMC04LjMzMywzLjU4Mi04LjMzMyw4djIyM2MwLDIuOTIzLDEuNzYsNS42MTIsNC4zMjQsNy4wMTdsMTA2LjU4Myw1OC4zMzQgICBjMS4xOTYsMC42NTUsMi41NjEsMC45ODMsMy44ODQsMC45ODNjMS4zMjMsMCwyLjY2Ny0wLjMyOCwzLjg2NC0wLjk4M2wxMDYuMzQ0LTU4LjMzNGMyLjU2NC0xLjQwNCw0LjAwMS00LjA5NCw0LjAwMS03LjAxN1Y4ICAgQzI2My4xNjcsMy41ODIsMjU5LjkxOCwwLDI1NS41LDB6IE0yNDcuMTY3LDIyNi4yNjFsLTk4LjUsNTMuOTUybC05OC41LTUzLjk1MlYxNmgxOTdWMjI2LjI2MXoiIGZpbGw9Int7Y29sb3J9fSIvPgoJPHBvbHlnb24gcG9pbnRzPSIyMTUuMTY3LDIwOS4wOTIgMjE1LjE2NywxNzEuNSAxNDguNzUxLDIwNi41IDgyLjE2NywxNzEuNSA4Mi4xNjcsMjA5LjAwMSAxNDguNzUsMjQ1LjMzNCAgIiBmaWxsPSJ7e2NvbG9yfX0iLz4KCTxwb2x5Z29uIHBvaW50cz0iMjE1LjE2NywxNTMuNDM4IDIxNS4xNjcsMTE1Ljg0NiAxNDguNzUxLDE1MC44NDYgODIuMTY3LDExNS44NDYgODIuMTY3LDE1My4zNDcgMTQ4Ljc1LDE4OS42OCAgIiBmaWxsPSJ7e2NvbG9yfX0iLz4KCTxwb2x5Z29uIHBvaW50cz0iMTIyLjc1MywxMTUuNjgzIDE0OS40OTksOTYuMjYzIDE3Ni4yNDcsMTE1LjcyMyAxNjYuMDMyLDg0LjMzIDE5Mi43NzgsNjUgMTU5LjcxOCw2NSAxNDkuNDk5LDMzLjU1NyAxMzkuMjgyLDY1ICAgIDEwNi4yMjIsNjUgMTMyLjk2OCw4NC4zMzYgICIgZmlsbD0ie3tjb2xvcn19Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+', expPanel.rightColor);

    Canvas.loadImage(img).then((img) => {
    Canvas.loadImage(avatarImg).then((avatarImg) => {
    Canvas.loadImage(orokinImg).then((orokinImg) => {
    Canvas.loadImage(blackBg).then((blackBg) => {
    Canvas.loadImage(iconXpVocal).then((iconXpVocal) => {
    Canvas.loadImage(iconXpText).then((iconXpText) => {
    Canvas.loadImage(iconLevelName).then((iconLevelName) => {
        
        function greenBg()
        {
            ctx.fillStyle = bgLeftColor;
            roundRect(ctx, 0, 0, width, height, 20, true, false)
            ctx.fillStyle = bgRightColor;
            roundRect(ctx, width / 2, 0, width / 2, height, 20, true, false)

            ctx.fillStyle = bgMiddleColor;
            var angle = 20 * Math.PI / 180;
            ctx.rotate(angle)
            roundRect(ctx, width / 2 - 10, -150, 45, width / 2, 0, true, false)
            ctx.fillStyle = bgLeftColor;
            roundRect(ctx, width / 2 - 5, -150, 5, width / 2, 0, true, false)
            roundRect(ctx, width / 2 + 5, -150, 5, width / 2, 0, true, false)

            ctx.fillStyle = bgRightColor;
            roundRect(ctx, width / 2 + 15, -150, 5, width / 2, 0, true, false)
            roundRect(ctx, width / 2 + 25, -150, 5, width / 2, 0, true, false)
            ctx.rotate(-angle)

            ctx.drawImage(img, 0, 0, 320, 250, 0, 0, 100, 100);
            ctx.drawImage(img, 390, 450, 230, 176, width - 100, height - 100, 100, 100);
            ctx.fillStyle = bgLeftColor;
            ctx.fillRect(55, 55, 45, 45);
            ctx.fillStyle = bgRightColor;
            ctx.fillRect(width - 100, height - 100, 100, 3);
            ctx.fillRect(width - 100, height - 100, 90, 8);
            ctx.fillRect(width - 100, height - 100, 80, 15);
            ctx.fillRect(width - 100, height - 100, 70, 24);
            ctx.fillRect(width - 100, height - 100, 60, 32);
            ctx.fillRect(width - 100, height - 100, 50, 42);
            ctx.fillRect(width - 100, height - 100, 45, 45);
            ctx.fillRect(width - 100, height - 90, 38, 50);
            ctx.fillRect(width - 100, height - 90, 28, 60);
            ctx.fillRect(width - 100, height - 90, 20, 70);
            ctx.fillRect(width - 100, height - 90, 10, 80);

            ctx.fillStyle = bgMiddleColor;
            drawCircle(width / 2 + 7.5, height / 2, 15);
            ctx.fillStyle = bgRightColor;
            drawCircle(width / 2 + 7.5, height / 2, 10);
            ctx.fillStyle = bgMiddleColor;
            drawCircle(width / 2 + 7.5, height / 2, 5);
        }

        function darkBg()
        {
            ctx.save();
            ctx.beginPath();
            roundRectPath(ctx, 0, 0, width, height, 40)
            ctx.closePath();
            ctx.clip()
            ctx.drawImage(blackBg, 0, 0, width, height);
            ctx.restore();
        }

        if(isDarkBg)
            darkBg();
        else
            greenBg();

        drawProgressBar(140, height - (120 - 80) - 5, width - (500 - 340), 20, progress);

        drawNickname(145, height - (120 - 63) - 5, nickname);
        drawExp(width - (500 - 390) - (dix(exp) + dix(maxExp) - 2) * 11.5, height - (120 - 63) - 5, exp, maxExp);

        //drawLevel(310 + 100, 20, level)
        drawLevel(width - (500 - (310 + 100)), 15, level)

        //drawRank(210 + 100 - dix(rank) * 17, 20, rank);
        drawRank(width - (500 - (210 + 80)) - 15, 15, rank);

        drawLevelName(110 + 100, 10, levelName);

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
        /*ctx.drawImage(orokinImg, -10, -10, 200, 200);*/

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
            drawText(x + (dix(exp) + 1) * 11.5 + 1, y, '/' + Math.trunc(maxExp) + ' XP', 20, expPanel.rightColor);
        }

        /*
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
        }*/

        /*
            ctx.drawImage('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI5Ny4zMzQgMjk3LjMzNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk3LjMzNCAyOTcuMzM0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+CjxnPgoJPHBhdGggZD0iTTI1NS41LDBoLTIxM2MtNC40MTgsMC04LjMzMywzLjU4Mi04LjMzMyw4djIyM2MwLDIuOTIzLDEuNzYsNS42MTIsNC4zMjQsNy4wMTdsMTA2LjU4Myw1OC4zMzQgICBjMS4xOTYsMC42NTUsMi41NjEsMC45ODMsMy44ODQsMC45ODNjMS4zMjMsMCwyLjY2Ny0wLjMyOCwzLjg2NC0wLjk4M2wxMDYuMzQ0LTU4LjMzNGMyLjU2NC0xLjQwNCw0LjAwMS00LjA5NCw0LjAwMS03LjAxN1Y4ICAgQzI2My4xNjcsMy41ODIsMjU5LjkxOCwwLDI1NS41LDB6IE0yNDcuMTY3LDIyNi4yNjFsLTk4LjUsNTMuOTUybC05OC41LTUzLjk1MlYxNmgxOTdWMjI2LjI2MXoiIGZpbGw9IiM5MWFmNGIiLz4KCTxwb2x5Z29uIHBvaW50cz0iMjE1LjE2NywyMDkuMDkyIDIxNS4xNjcsMTcxLjUgMTQ4Ljc1MSwyMDYuNSA4Mi4xNjcsMTcxLjUgODIuMTY3LDIwOS4wMDEgMTQ4Ljc1LDI0NS4zMzQgICIgZmlsbD0iIzkxYWY0YiIvPgoJPHBvbHlnb24gcG9pbnRzPSIyMTUuMTY3LDE1My40MzggMjE1LjE2NywxMTUuODQ2IDE0OC43NTEsMTUwLjg0NiA4Mi4xNjcsMTE1Ljg0NiA4Mi4xNjcsMTUzLjM0NyAxNDguNzUsMTg5LjY4ICAiIGZpbGw9IiM5MWFmNGIiLz4KCTxwb2x5Z29uIHBvaW50cz0iMTIyLjc1MywxMTUuNjgzIDE0OS40OTksOTYuMjYzIDE3Ni4yNDcsMTE1LjcyMyAxNjYuMDMyLDg0LjMzIDE5Mi43NzgsNjUgMTU5LjcxOCw2NSAxNDkuNDk5LDMzLjU1NyAxMzkuMjgyLDY1ICAgIDEwNi4yMjIsNjUgMTMyLjk2OCw4NC4zMzYgICIgZmlsbD0iIzkxYWY0YiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=', x + 5 + offset, y + h + 3, 15, 15);
            drawText(x + offset + 25, y + h + 9, levelName, 15, expPanel.rightColor); */
        function drawLevel(x, y, level)
        {
            drawText(x, y, 'LEVEL', 15, levelColor);
            drawText(x + 38 / 2 - dix(level) * 10 - 5, y + 20, Math.trunc(level), 30, levelColor);
        }

        function drawRank(x, y, rank)
        {
            drawText(x, y, 'RANK', 15, rankColor);
            drawText(x + 38 / 2 - dix(rank) * 10 - 20, y + 20, '#' + Math.trunc(rank), 30, rankColor);
            drawText(x + 7 + 38 / 2 + dix(rank) * 10 + 15, y + 25, '/' + Math.trunc(rankTotal), 15, rankColor);
        }

        function drawLevelName(x, y, levelName)
        {
            ctx.drawImage(iconLevelName, x, y, 15, 15);
            /*ctx.drawImage('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI5Ny4zMzQgMjk3LjMzNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk3LjMzNCAyOTcuMzM0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+CjxnPgoJPHBhdGggZD0iTTI1NS41LDBoLTIxM2MtNC40MTgsMC04LjMzMywzLjU4Mi04LjMzMyw4djIyM2MwLDIuOTIzLDEuNzYsNS42MTIsNC4zMjQsNy4wMTdsMTA2LjU4Myw1OC4zMzQgICBjMS4xOTYsMC42NTUsMi41NjEsMC45ODMsMy44ODQsMC45ODNjMS4zMjMsMCwyLjY2Ny0wLjMyOCwzLjg2NC0wLjk4M2wxMDYuMzQ0LTU4LjMzNGMyLjU2NC0xLjQwNCw0LjAwMS00LjA5NCw0LjAwMS03LjAxN1Y4ICAgQzI2My4xNjcsMy41ODIsMjU5LjkxOCwwLDI1NS41LDB6IE0yNDcuMTY3LDIyNi4yNjFsLTk4LjUsNTMuOTUybC05OC41LTUzLjk1MlYxNmgxOTdWMjI2LjI2MXoiIGZpbGw9IiM5MWFmNGIiLz4KCTxwb2x5Z29uIHBvaW50cz0iMjE1LjE2NywyMDkuMDkyIDIxNS4xNjcsMTcxLjUgMTQ4Ljc1MSwyMDYuNSA4Mi4xNjcsMTcxLjUgODIuMTY3LDIwOS4wMDEgMTQ4Ljc1LDI0NS4zMzQgICIgZmlsbD0iIzkxYWY0YiIvPgoJPHBvbHlnb24gcG9pbnRzPSIyMTUuMTY3LDE1My40MzggMjE1LjE2NywxMTUuODQ2IDE0OC43NTEsMTUwLjg0NiA4Mi4xNjcsMTE1Ljg0NiA4Mi4xNjcsMTUzLjM0NyAxNDguNzUsMTg5LjY4ICAiIGZpbGw9IiM5MWFmNGIiLz4KCTxwb2x5Z29uIHBvaW50cz0iMTIyLjc1MywxMTUuNjgzIDE0OS40OTksOTYuMjYzIDE3Ni4yNDcsMTE1LjcyMyAxNjYuMDMyLDg0LjMzIDE5Mi43NzgsNjUgMTU5LjcxOCw2NSAxNDkuNDk5LDMzLjU1NyAxMzkuMjgyLDY1ICAgIDEwNi4yMjIsNjUgMTMyLjk2OCw4NC4zMzYgICIgZmlsbD0iIzkxYWY0YiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=', x, y, 15, 15);*/
            drawText(x + 15 / 2 - levelName.length * 4.5, y + 15 + 7, levelName, 17, expPanel.rightColor);
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
            for(var i = 0; i < 25; ++i)
                drawCircle(x + 10.4 * (i + 1) + 5 * i, y + 10, 5);
            
            var xpVocal = Math.trunc(expVocal);
            ctx.drawImage(iconXpVocal, x + 5, y + h + 3, 15, 15);
            drawText(x + 20, y + h + 9, xpVocal + 'XP', 15, expPanel.leftColor);
            
            var offset = 70 + (dix(xpVocal) - 1) * 15;
            var xpText = Math.trunc(expText);
            ctx.drawImage(iconXpText, x + 5 + offset, y + h + 3, 15, 15);
            drawText(x + offset + 25, y + h + 9, xpText + 'XP', 15, expPanel.leftColor);
            /*
            offset = offset + 70 + (dix(xpText) - 1) * 15;
            ctx.drawImage('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI5Ny4zMzQgMjk3LjMzNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk3LjMzNCAyOTcuMzM0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+CjxnPgoJPHBhdGggZD0iTTI1NS41LDBoLTIxM2MtNC40MTgsMC04LjMzMywzLjU4Mi04LjMzMyw4djIyM2MwLDIuOTIzLDEuNzYsNS42MTIsNC4zMjQsNy4wMTdsMTA2LjU4Myw1OC4zMzQgICBjMS4xOTYsMC42NTUsMi41NjEsMC45ODMsMy44ODQsMC45ODNjMS4zMjMsMCwyLjY2Ny0wLjMyOCwzLjg2NC0wLjk4M2wxMDYuMzQ0LTU4LjMzNGMyLjU2NC0xLjQwNCw0LjAwMS00LjA5NCw0LjAwMS03LjAxN1Y4ICAgQzI2My4xNjcsMy41ODIsMjU5LjkxOCwwLDI1NS41LDB6IE0yNDcuMTY3LDIyNi4yNjFsLTk4LjUsNTMuOTUybC05OC41LTUzLjk1MlYxNmgxOTdWMjI2LjI2MXoiIGZpbGw9IiM5MWFmNGIiLz4KCTxwb2x5Z29uIHBvaW50cz0iMjE1LjE2NywyMDkuMDkyIDIxNS4xNjcsMTcxLjUgMTQ4Ljc1MSwyMDYuNSA4Mi4xNjcsMTcxLjUgODIuMTY3LDIwOS4wMDEgMTQ4Ljc1LDI0NS4zMzQgICIgZmlsbD0iIzkxYWY0YiIvPgoJPHBvbHlnb24gcG9pbnRzPSIyMTUuMTY3LDE1My40MzggMjE1LjE2NywxMTUuODQ2IDE0OC43NTEsMTUwLjg0NiA4Mi4xNjcsMTE1Ljg0NiA4Mi4xNjcsMTUzLjM0NyAxNDguNzUsMTg5LjY4ICAiIGZpbGw9IiM5MWFmNGIiLz4KCTxwb2x5Z29uIHBvaW50cz0iMTIyLjc1MywxMTUuNjgzIDE0OS40OTksOTYuMjYzIDE3Ni4yNDcsMTE1LjcyMyAxNjYuMDMyLDg0LjMzIDE5Mi43NzgsNjUgMTU5LjcxOCw2NSAxNDkuNDk5LDMzLjU1NyAxMzkuMjgyLDY1ICAgIDEwNi4yMjIsNjUgMTMyLjk2OCw4NC4zMzYgICIgZmlsbD0iIzkxYWY0YiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=', x + 5 + offset, y + h + 3, 15, 15);
            drawText(x + offset + 25, y + h + 9, levelName, 15, expPanel.rightColor);*/
        }

        function roundRectPath(ctx, x, y, width, height, radius)
        {
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
        }

        function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
            if(typeof stroke == 'undefined')
            {
                stroke = true;
            }

            roundRectPath(ctx, x, y, width, height, radius);

            if(fill)
            {
                ctx.fill();
            }
            if(stroke)
            {
                ctx.stroke();
            }
        }

        callback(undefined, { ctx, canvas });
    })
    })
    })
    })
    })
    })
    })
}

Banner.prototype.createBuffer = function(template, callback) {
    /*const ctx = this.createCanvas(template);
    ctx.toBuffer(callback);*/
    this.createCanvas(template, (e, { canvas }) => {
        callback(undefined, canvas.toBuffer());
    });
}

Banner.prototype.createStream = function(template, callback) {
    const ctx = this.createCanvas(template);
    ctx.toStream(callback);
}

module.exports = Banner;
