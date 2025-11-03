//! This comment is important!
const toKebab = (camelStr: string): string => {  //v{{package.version}}
   const dash = (word: string) => '-' + word.toLowerCase();
   return camelStr.replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: {{package.version}}
