
export interface IBannerTemplate {
    key: string | number
    name: string
    template: IBannerTemplateData
}
export interface IBannerTemplateDataText {
    color: string
    sizeCoef?: number
    borderColor?: string
    borderSize?: number
}
export interface IBannerTemplateDataLight {
    bgLeftColor?: string
    fore: IBannerTemplateDataText
    back?: IBannerTemplateDataText
    progressBar: {
        fore: string
        back: string
    }
    avatarAroundColor?: string
    bgImg: string
    drawMethod?: string
}
export interface IBannerTemplateDataOld {
    bgLeftColor: string
    bgRightColor: string
    bgMiddleColor: string
    rankTitleColor: string
    progressBar: {
        bgColor: string
        bgBorderColor: string
        foreColor: string
    }
    nicknameColor: string
    expPanel: {
        leftColor: string
        rightColor: string
    }
    levelColor: string
    rankColor: string
    avatarAroundColor: string
    bgImg: string
    drawMethod?: string
}
export type IBannerTemplateData = IBannerTemplateDataFull | IBannerTemplateDataOld | IBannerTemplateDataLight
export interface IBannerTemplateDataFull {
    bg: {
        leftColor: string
    }
    rankTitle: {
        iconColor: string
        text: IBannerTemplateDataText
    }
    level: {
        fore: IBannerTemplateDataText
        back: IBannerTemplateDataText
    }
    rank: {
        fore: IBannerTemplateDataText
        back: IBannerTemplateDataText
    }
    name: IBannerTemplateDataText
    vocalXP: {
        iconColor: string
        text: IBannerTemplateDataText
    }
    textXP: {
        iconColor: string
        text: IBannerTemplateDataText
    }
    xp: {
        left: IBannerTemplateDataText
        right: IBannerTemplateDataText
    }
    progressBar: {
        bgColor: string
        bgBorderColor: string
        foreColor: string
    }
    avatarAroundColor: string
    bgImg: string
    drawMethod?: string
}

const templates: IBannerTemplate[] = [{
    key: 1,
    name: 'Tout sobre, tout gris',
    template: (() => {
        const progressBar = {
            bgColor: '#42464d',
            bgBorderColor: '#848c9a',
            foreColor: '#848c9a'
        };

        return {
            bgImg: 'https://cdn.discordapp.com/attachments/514172417174798341/516346545335959565/Sans_titre123.png',
            bgLeftColor: '#f8faed',
            bgRightColor: '#ebf4d7',
            bgMiddleColor: '#42464d',
            progressBar: progressBar,
            nicknameColor: progressBar.foreColor,
            expPanel: {
                leftColor: progressBar.foreColor,
                rightColor: '#717782'
            },
            rankTitleColor: '#717782',
            levelColor: progressBar.foreColor,
            rankColor: progressBar.foreColor,
            drawMethod: 'darkBg',
            avatarAroundColor: progressBar.foreColor
        }
    })()
}, {
    key: 2,
    name: 'Tout beau, tout vert',
    template: (() => {
        const progressBar = {
            bgColor: '#fcfef1',
            bgBorderColor: '#91af4b',
            foreColor: '#91af4b'
        };

        return {
            bgImg: 'http://image.freepik.com/free-vector/green-energy-background_23-2147514943.jpg',
            bgLeftColor: '#f8faed',
            bgRightColor: '#ebf4d7',
            bgMiddleColor: undefined,
            progressBar: progressBar,
            nicknameColor: progressBar.foreColor,
            expPanel: {
                leftColor: progressBar.foreColor,
                rightColor: '#569105'
            },
            rankTitleColor: '#569105',
            levelColor: progressBar.foreColor,
            rankColor: progressBar.foreColor,
            drawMethod: 'greenBg',
            avatarAroundColor: progressBar.foreColor
        }
    })()
}, {
    key: 3,
    name: "C'est magique !",
    template: {
        "fore": {
            "color": "rgb(230,219,198)",
            "borderColor": "rgb(77,70,88)",
            "borderSize": 3
        },
        "bgLeftColor": "rgb(77,70,88)",
        "progressBar": {
            "fore": "rgb(77,70,88)",
            "back": "rgb(230,219,198)"
        },
        "avatarAroundColor": "rgb(130,97,54)",
        "bgImg": "https://cdn.discordapp.com/attachments/483003722830577671/867007080760868864/112609-P969sQ0jIU6S.jpg"
    }

}, {
    key: 4,
    name: "gentleman",
    template: {
 "fore": {
        "color": "rgb(255,255,255)",
        "borderColor": "rgb(255,255,255)",
        "borderSize": 0.5
    },
    "bgLeftColor": "rgb(0,0,0)",
    "progressBar": {
        "fore": "rgb(94,201,238)",
        "back": "rgb(215,222,225)"
    },
    "avatarAroundColor": "rgb(94,201,238)",
    "bgImg": "https://cdn.discordapp.com/attachments/696363238878740541/867049181884317716/Sans_titre-2.png"
}];

const result = {
    list: templates,
    indexed: {},
    default: undefined
};

for(var i in result.list)
{
    var item = result.list[i];
    result.indexed[item.key] = item;
}

result.default = result.indexed[1];

export default result;
