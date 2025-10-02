const NeoSpeech = require('./client');
const { NeoSpeechError } = require('./error');

module.exports = NeoSpeech;
module.exports.NeoSpeech = NeoSpeech;
module.exports.NeoSpeechError = NeoSpeechError;
module.exports.default = NeoSpeech;
