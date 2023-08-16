//! add-dist-header v1.2.2 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

//! This comment is important!
const toKebab = (camelStr: string): string => {  //v1.2.2
   const dash = (word: string) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: 1.2.2
