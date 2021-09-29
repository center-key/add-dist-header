const toKebab = (camelStr) => {  //v{{{version}}}
   const dash = (word) => '-' + word.toLowerCase();
   return ('' + camelStr).replace(/([A-Z]+)/g, dash).replace(/\s|^-/g, '');
   };

module.exports = toKebab;  //version: {{{version}}}
