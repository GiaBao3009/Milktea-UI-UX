const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\baold\\Downloads\\Trà sữa trang UI_UX\\src';

const replacements = [
  { from: /#3d6751/gi, to: '#ff8a00' },
  { from: /#A8D5BA/gi, to: '#ffcc80' },
  { from: /#e8f5ec/gi, to: '#fff3e6' },
  { from: /#254f3a/gi, to: '#cc6e00' }
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = content;
      for (const replace of replacements) {
        modified = modified.replace(replace.from, replace.to);
      }
      if (modified !== content) {
        fs.writeFileSync(fullPath, modified);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(dir);
console.log('Done');
