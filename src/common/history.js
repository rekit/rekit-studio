import { createBrowserHistory } from 'history';

// a singleton history object
const history = createBrowserHistory();
// const push = history.push;
// history.push = function() {
//   console.log('pushpush');
//   push.apply(history, arguments);
// }
export default history;
