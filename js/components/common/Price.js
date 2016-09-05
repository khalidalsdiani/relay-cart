/**
 * Created by Xin on 5/24/16.
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import './Price.scss';

export default class Price extends React.Component {

  render() {
    const { className, value } = this.props;

    return (
      <span className="Price" >
        {`￥${parseFloat(value).toFixed(2)}`}
      </span>
    );
  }
}

Price.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
};
