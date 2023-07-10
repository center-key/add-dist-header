//! add-dist-header v1.1.1 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

const toKebab = (camelStr) => {  //v1.1.1
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

module.exports = toKebab;  //version: 1.1.1
