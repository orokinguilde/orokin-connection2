
const templates = [{
    key: 1,
    name: 'Tout sobre, tout gris',
    template: {
        isDarkColor: true,
        isDarkBg: true
    }
}, {
    key: 2,
    name: 'Tout beau, tout vert',
    template: {
        isDarkColor: false,
        isDarkBg: false
    }
}];

const result = {
    list: templates,
    indexed: {}
};

for(var i in result.list)
{
    var item = result.list[i];
    result.indexed[item.key] = item;
}

result.default = result.indexed[1];

module.exports = result;
