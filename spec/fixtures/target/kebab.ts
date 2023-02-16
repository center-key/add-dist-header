//! add-dist-header v1.0.0 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

//! The toKebab function is important (and don't substitute the version number)
const toKebab = (camelStr: string): string => {  //v{{pkg.version}}
   const dash = (word: string) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: {{pkg.version}}
