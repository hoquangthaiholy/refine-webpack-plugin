module.exports = function (content, data) {

    var render = function (str) { return eval(str); };

    content = content.replace(/\{\{\s*(\S*)\s*\}\}/gm, (group, match) => {
        return render.call(data,match) || '';
    })

    return content;
}