const { deployToNetlify } = require('../services/netlify');
const Project = require('../models/Project'); // Assuming you store projects in MongoDB

// Controller function to deploy a project
exports.deployProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    // Fetch project details from the database
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Deploy project to Netlify
    const deploymentUrl = await deployToNetlify(project);

    // Update project with deployment URL
    project.deploymentUrl = deploymentUrl;
    await project.save();

    res.status(200).json({ message: 'Project deployed successfully!', deploymentUrl });
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({ error: 'Failed to deploy project' });
  }
};
