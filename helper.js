
function evalFn(command){
    var result = '';
    command = command.split(/(['"].*['"])/g).map(value => {
        return (value.split(/^['"]/).length > 1) ? value: 
            value.replace(/(\w+)/g, (g,m) => {
                return /^\d/.exec(m) ? m : 'this.' + m;
            });
    }).join('');
    try {
        result = eval(command);
    } catch(e) {
        if (e instanceof ReferenceError)
            result = this[command];
    }
    return result;
}

function evalIf(command){
    command = /@if +\((.*)\)([^@]*)/g()
}

module.exports = function (content, data, callback) {

    content = content.replace(/\{\{(.*)\}\}/g, (group, match) => {
        return evalFn.call(data,match.trim()) || '';
    })

    return callback ? callback(content,data) : content;
}