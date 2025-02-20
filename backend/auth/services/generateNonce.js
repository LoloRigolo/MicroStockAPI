const crypto = require('crypto');

function generateNonce(infos, difficulty = 3) {
  let nonce = 0;
  const targetPrefix = "0".repeat(difficulty);

  while (true) {
    const dataToHash = `${JSON.stringify(infos)}${nonce}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    if (hash.startsWith(targetPrefix)) {
      return { nonce, proofOfWork: hash };
    }

    nonce++;
  }
}

module.exports = { generateNonce };