import escapeRegExp from 'greasebox/escape-reg-exp';

let indentReg = /\n\s*/;

export default function dedent(callsite, ...values) {
  let indent;
  return callsite.map((str, idx) => {
    let matches = str.match(indentReg);
    if(matches) {
      if(!indent) {
        indent = new RegExp(escapeRegExp(matches[0]), 'g');
      }
      str = str.replace(indent, '\n');
    }
    if(values.length) {
      str += values.shift();
    }
    return str;
  }).join('');
}

