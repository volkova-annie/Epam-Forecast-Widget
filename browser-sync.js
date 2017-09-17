const BS = require('browser-sync');

const config = {
  server: true,
  files: "**/*",
  open: false,
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false
  }
}

BS(config);
