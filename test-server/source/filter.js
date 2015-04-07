import RequireFilter from '../../dist/require-filter';
import path from 'path';
import fs from 'fs';

const requireFilter = new RequireFilter({
  fileRoot: path.resolve(__dirname, '..'),
  urlRoot: '/test-server/',
  //version: version
});
requireFilter.filter('.css!');
requireFilter.filter('.*!asset');
requireFilter.filter('.*!text', (p) => {
  if(fs.existsSync(p)) {
    return fs.readFileSync(p, 'utf8');
  }
  return '';
});

