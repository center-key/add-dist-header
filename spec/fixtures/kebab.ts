//! The toKebab function is important (and don't subsitute the version number)
const toKebab = (camelStr: string): string => {  //v~~~version~~~
   const dash = (word: string) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: ~~~version~~~
