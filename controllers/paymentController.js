const { Connection, PublicKey } = require('@solana/web3.js');

exports.verifyPayment = async (req, res) => {
  const { transactionId, expectedAmount, recipient } = req.body;

  try {
    const connection = new Connection(process.env.SOLANA_CLUSTER);
    const transaction = await connection.getTransaction(transactionId);

    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    const isValid = transaction.meta.postBalances[0] === expectedAmount &&
                    transaction.transaction.message.accountKeys[1].toBase58() === recipient;

    if (isValid) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid transaction' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
