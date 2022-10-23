//! The toKebab function is important (and don't substitute the version number)
const toKebab = (camelStr: string): string => {  //v{{pkg.version}}
   const dash = (word: string) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: {{pkg.version}}
