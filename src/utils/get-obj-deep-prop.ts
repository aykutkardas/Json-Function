// https://github.com/burakcan/mb

// Original
// var mb=p=>o=>p.map(c=>o=(o||{})[c])&&o

// Customize
const mb = p => o => p.split(".").map(c => (o = (o || {})[c])) && o;

export default mb;
