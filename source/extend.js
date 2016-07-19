export default function extend(obj, ...args) {
  Object.assign(obj, ...args)
  return obj
}
