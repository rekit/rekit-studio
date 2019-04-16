import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchGitStatus } from './redux/actions';
import element from '../../common/element';

export class OverviewWidget extends Component {
  static propTypes = {
    gitManager: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (!this.props.gitManager.status) this.props.actions.fetchGitStatus();
  }

  renderNotGitRepo() {
    return <div className="widget-container">Not a git repo or not initialized by git.</div>;
  }

  renderLoading() {
    return <div className="widget-container">Loading...</div>;
  }

  renderFiles(status) {
    const labelMap = {
      modified: 'Modified',
      not_added: 'Untracked',
      deleted: 'Deleted',
    };
    return ['modified', 'not_added', 'deleted'].map(key => {
      if (status[key].length > 0) {
        return (
          <section key={key}>
            <h6>
              {labelMap[key]} ({status[key].length}):
            </h6>
            <ul>
              {status[key].map(file => (
                <li key={file} onClick={() => element.show(file)}>
                  {file}
                </li>
              ))}
            </ul>
          </section>
        );
      }
      return null;
    });
  }

  render() {
    const { status, isGitRepo } = this.props.gitManager;
    return (
      <div className="git-manager-overview-widget dashboard-widget">
        <h3>Git Status</h3>
        {!isGitRepo && this.renderNotGitRepo()}
        {isGitRepo && !status && this.renderLoading()}
        {isGitRepo && status && (
          <div className="widget-container">
            <section>
              <p>On branch {status.current}.</p>
              {status.ahead > 0 ? (
                <p>
                  Ahead of '{status.tracking}' by <span className="blue2">{status.ahead}</span>{' '}
                  commits.
                </p>
              ) : (
                <p>
                  Up to date with '{status.tracking}'.
                </p>
              )}
            </section>
            {status.files.length > 0 ? (
              this.renderFiles(status)
            ) : (
              <section>
                <h6 className="green2">nothing to commit, working tree clean</h6>
              </section>
            )}
          </div>
        )}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    gitManager: state.gitManager,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchGitStatus }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewWidget);
