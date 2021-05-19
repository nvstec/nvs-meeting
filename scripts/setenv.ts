require('dotenv').config()
const fs = require('fs');

const environmentFile = `export const environment = {
    AZURE_CLIENT_ID: '${process.env.AZURE_CLIENT_ID}',
    production: true
};
`;

// Generate environment.ts file
fs.writeFile('./src/environments/environment.ts', environmentFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated`);
  }
});