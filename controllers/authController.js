const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyWallet = async (req, res) => {
  const { wallet } = req.body;

  try {
    let user = await User.findOne({ wallet });
    if (!user) {
      user = await User.create({ wallet, projects: [] });
    }

    const token = jwt.sign({ wallet: user.wallet }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};
