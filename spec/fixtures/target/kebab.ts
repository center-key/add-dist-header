//! add-dist-header v1.2.0 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

//! This comment is important!
const toKebab = (camelStr: string): string => {  //v{{pkg.version}}
   const dash = (word: string) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: {{pkg.version}}
