const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  const { wallet, name, data } = req.body;

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const subdomain = `${name.toLowerCase()}.${process.env.DOMAIN}`;
    const project = await Project.create({ user: user._id, name, data, subdomain });

    user.projects.push(project._id);
    await user.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Project creation failed' });
  }
};

exports.getProjects = async (req, res) => {
  const { wallet } = req.params;

  try {
    const user = await User.findOne({ wallet }).populate('projects');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
