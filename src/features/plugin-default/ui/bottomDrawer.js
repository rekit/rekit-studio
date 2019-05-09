import React from 'react';
import OutputView from '../../home/OutputView';
import { ProblemsView, ProblemPaneTitle } from '../';
export class C1 extends React.Component {
  render() {
    return <div>abc</div>;
  }
}
export default {
  getPanes() {
    return [
      {
        title: 'Output',
        key: 'output',
        order: 10,
        component: OutputView,
      },
      {
        title: <ProblemPaneTitle />,
        key: 'problems',
        order: 1,
        component: ProblemsView,
      },
    ];
  },
};
