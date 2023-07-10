/* Kebab --- MIT License --- Original header comment */

const toKebab = (camelStr) => {  //v{{pkg.version}}
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

module.exports = toKebab;  //version: {{pkg.version}}
