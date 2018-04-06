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
    const options = loaderUtils.getOptions(this) || {};
    const callback = this.async();

    content = JSON.stringify(content);

    content = content.replace(/@include\(['" ]*(.[^ ]*)['" ]*\)/g, (group, file) => {
        return `\" + require('${loaderUtils.urlToRequest(file)}') + \"`;
    })

    callback(null, `module.exports = ${content} `, map, meta);
}