const path = require('path');
const loaderUtils = require('loader-utils');
/**
 *  Refine Loader
 *  Replace @include ditective 
 * 
 * @param {*} content 
 * @param {*} map 
 * @param {*} meta 
 */
module.exports = function (content, map, meta) {
    const callback = this.async();

    content = JSON.stringify(content);

    // SASS/SCSS Import Syntax
    content = content.replace(/@import +['"](\S+)['"];/g, (group, file) => {
        return `\" + require('${loaderUtils.urlToRequest(file)}') + \"`;
    })

    // HTML Import Syntax
    content = content.replace(/@include\(['" ]*(.[^ ]*)['" ]*\)/g, (group, file) => {
        return `\" + require('${loaderUtils.urlToRequest(file)}') + \"`;
    })

    callback(null, `module.exports = ${content} `, map, meta);
}