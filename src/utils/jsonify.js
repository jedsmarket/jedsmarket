export default function jsonify(obj) {
  return JSON.parse(JSON.stringify(obj));
}
