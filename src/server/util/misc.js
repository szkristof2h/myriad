import sanitizeHtml from 'sanitize-html';

export function toObject(arr, key) {
  return arr === null || arr.length == 0 ? {} : Object.assign({}, ...arr.map(item => ({ [item[key]]: item })));
}

export function handleErrors(t, e) {
  console.warn(t);
  console.warn(e);
  
  return {
    errors: e.hasOwnProperty('error') ? [e.error] : e.hasOwnProperty('errors') ?
      Object.keys(e.errors).map(k => `Value for '${k}' is not valid: ${e.errors[k].message} `) : e, type: t
  }
}

export function sanitize(text) {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
}