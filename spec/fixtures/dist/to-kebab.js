//! add-dist-header v0.0.2 ~ github:center-key/add-dist-header ~ MIT License

const toKebab = (camelStr) => {  //v0.0.2
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

module.exports = toKebab;  //version: 0.0.2
