/**
 * Created by Soon on 9/14/2015.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import './Portal.scss';


export default class Portal extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    hidden: PropTypes.bool,
    children: PropTypes.any,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    id: 'Portal',
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  static defaultProps = {
    children: null,
  };

  componentDidMount() {
    const { id, hidden, className, onClick } = this.props;
    let p = id && document.getElementById(id);
    if (!p) {
      p = document.createElement('div');
      p.id = id;
      p.hidden = hidden;
      if (className) {
        p.className = className;
      }

      if (typeof onClick === 'function') {
        p.onclick = onClick;
      }

      document.body.appendChild(p);
    }
    this.portalElement = p;
    this.componentDidUpdate();
  }

  componentWillReceiveProps(nextProps) {
    const { hidden } = nextProps;
    // console.log(this);
    // const p = this.props.id && document.getElementById(this.props.id);
    this.portalElement.hidden = hidden;
  }

  componentDidUpdate() {
    ReactDOM.render(this.props.children, this.portalElement);
  }

  componentWillUnmount() {
    if (document.getElementById(this.props.id)) {
      ReactDOM.unmountComponentAtNode(this.portalElement);
      document.body.removeChild(this.portalElement);
    }
  }

  render() {
    return null;
  }
}
