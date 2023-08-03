//! add-dist-header v1.2.0 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

const toKebab = (camelStr) => {  //v1.2.0
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: 1.2.0
