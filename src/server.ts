/* eslint-disable no-console */
/* eslint-disable import/first */
import './utils/moduleAlias';
import app from './app';

const port: number = parseInt(`${process.env.SERVER_PORT}`, 10) || 3001;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
