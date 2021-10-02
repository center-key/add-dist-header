//! add-dist-header v0.1.1 ~ https://github.com/center-key/add-dist-header ~ MIT License

const toKebab = (camelStr) => {  //v0.1.1
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

module.exports = toKebab;  //version: 0.1.1
