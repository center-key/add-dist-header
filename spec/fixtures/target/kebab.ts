//! add-dist-header v1.5.1 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

//! This comment is important!
const toKebab = (camelStr: string): string => {  //v{{package.version}}
   const dash = (word: string) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

export { toKebab };  //version: {{package.version}}
