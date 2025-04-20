//! add-dist-header v1.4.5 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

const toKebab = (camelStr) => {  //v1.4.5
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: 1.4.5
