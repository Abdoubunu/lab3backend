const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const NETLIFY_API_URL = 'https://api.netlify.com/api/v1';
const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;

// Deploy project to Netlify
exports.deployToNetlify = async (project) => {
  try {
    const formData = new FormData();

    // Zip the project files
    const projectDir = path.resolve(__dirname, `../projects/${project._id}`);
    const zipFilePath = path.resolve(projectDir, 'project.zip');
    await zipProjectFiles(projectDir, zipFilePath);

    formData.append('file', fs.createReadStream(zipFilePath));
    formData.append('site_name', project.name); // Site name in Netlify
    formData.append('custom_domain', `${project.name}.${process.env.DOMAIN}`);

    // Send request to Netlify API
    const response = await axios.post(
      `${NETLIFY_API_URL}/sites`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
          ...formData.getHeaders(),
        },
      }
    );

    // Return the deployment URL
    return response.data.ssl_url;
  } catch (error) {
    console.error('Netlify API error:', error.response?.data || error.message);
    throw new Error('Deployment to Netlify failed');
  }
};

// Helper function to zip project files
const zipProjectFiles = (sourceDir, outputFilePath) => {
  const archiver = require('archiver');
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver('zip');

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};
