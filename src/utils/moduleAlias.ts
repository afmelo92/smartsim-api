import moduleAlias from 'module-alias';
import path from 'path';

const files = path.resolve(__dirname, '../');

moduleAlias.addAliases({
  '@controllers': path.join(files, 'controllers'),
  '@repositories': path.join(files, 'repositories'),
  '@middlewares': path.join(files, 'middlewares'),
  '@providers': path.join(files, 'providers'),
  '@routes': path.join(files, 'routes'),
  '@utils': path.join(files, 'utils'),
  '@config': path.join(files, 'config'),
});
