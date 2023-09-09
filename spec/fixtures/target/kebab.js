//! add-dist-header v1.3.1 🫓🍢🫓 https://github.com/center-key/add-dist-header 🫓🍢🫓 MIT License

const toKebab = (camelStr) => {  //v1.3.1
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: 1.3.1
