const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\baold\\Downloads\\Trà sữa trang UI_UX\\src';

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = content;
      
      // Replace inline background gradients that start with #ff8a00 but end with something else
      // e.g. style={{ background: 'linear-gradient(135deg, #ff8a00, #a4d1b6)' }}
      // -> style={{ background: '#ff8a00' }}
      modified = modified.replace(/linear-gradient\([^,]+,\s*#ff8a00[^)]+\)/gi, '#ff8a00');
      
      // Replace arbitrary green linear gradients missed in previous step
      modified = modified.replace(/linear-gradient\([^)]+\)/gi, '#ff8a00');
      modified = modified.replace(/bg-\[#ff8a00\]/gi, 'bg-[#ff8a00]'); // if the above creates bg-[#ff8a00] it's fine

      if (modified !== content) {
        fs.writeFileSync(fullPath, modified);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(dir);
console.log('Done');
