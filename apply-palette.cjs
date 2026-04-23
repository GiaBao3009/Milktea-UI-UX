const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\baold\\Downloads\\Trà sữa trang UI_UX\\src';

const replacements = [
  // Primary Oranges
  { from: /#ff8a00/gi, to: '#fb6514' },
  { from: /#cc6e00/gi, to: '#ff5b00' },
  { from: /#ffcc80/gi, to: '#f68749' },
  { from: /#fff3e6/gi, to: '#fff4e9' },

  // Primary Text & Darks
  { from: /#1a1c1c/gi, to: '#101828' },
  { from: /#0f172a/gi, to: '#101828' },
  
  // Secondary Text
  { from: /#414943/gi, to: '#1d2939' },
  { from: /#5b6760/gi, to: '#1d2939' },
  { from: /#4b5563/gi, to: '#1d2939' },

  // Muted Text
  { from: /#55635d/gi, to: '#344054' },
  { from: /#717973/gi, to: '#344054' },
  { from: /#64748b/gi, to: '#344054' },

  // Grays
  { from: /#9ca3af/gi, to: '#a3a3a3' },

  // Borders & Dividers
  { from: /#e5e7eb/gi, to: '#d0d5dd' },
  { from: /#d1d5db/gi, to: '#d0d5dd' },
  { from: /#d9e6dd/gi, to: '#d0d5dd' },
  { from: /#e8e8e8/gi, to: '#d0d5dd' },

  // Backgrounds
  { from: /#f9f9f9/gi, to: '#f9fafb' },
  { from: /#f3f4f6/gi, to: '#f9fafb' },
  { from: /#f3f3f3/gi, to: '#f9fafb' },
  { from: /#f8f9fa/gi, to: '#f9fafb' }
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
      
      for (const rep of replacements) {
        modified = modified.replace(rep.from, rep.to);
      }

      if (modified !== content) {
        fs.writeFileSync(fullPath, modified);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(dir);
console.log('Done mapping palette');
