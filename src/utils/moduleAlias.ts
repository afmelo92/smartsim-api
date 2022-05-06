import moduleAlias from 'module-alias';
import path from 'path';

const files = path.resolve(__dirname, '../');

moduleAlias.addAliases({
  '@controllers': path.join(files, 'controllers'),
  '@middlewares': path.join(files, 'middlewares'),
  '@routes': path.join(files, 'routes'),
  '@utils': path.join(files, 'utils'),
});