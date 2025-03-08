const express = require('express');
const path = require('path');
const app = express();
const port = 5005;

// Serve static files from the 'models' directory
app.use('/models', express.static(path.join(__dirname, './mo/model.json')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
