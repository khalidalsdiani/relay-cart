/**
 * Created by Soon on 9/14/2015.
 */

import React, { PropTypes } from 'react';
import { Map } from 'immutable';

import RegExes from '../../utils/RegExes';
import './InputQuantity.scss';
export default class InputQuantity extends React.Component {

  static propTypes = {
    min: PropTypes.number,
    value: PropTypes.number,
    onQuantityChange: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    min: 0,
    value: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({
        value: props.value,
        min: props.min,
      }),
    };
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  _handleMinus = ()=> {
    const { onQuantityChange } = this.props;
    const { value, min } = this.state.data.toJS();

    if (min < value) {
      this.setImmState(d => d.set('value', parseInt(value - 1, 10)));
      if (typeof onQuantityChange === 'function') {
        onQuantityChange(parseInt(value - 1, 10));
      }
    }
  };

  _handleAdd = ()=> {
    const { onQuantityChange } = this.props;
    const { value } = this.state.data.toJS();
    this.setImmState(d => d.set('value', parseInt(value + 1, 10)));
    if (typeof onQuantityChange === 'function') {
      onQuantityChange(parseInt(value + 1, 10));
    }
  };

  _handleChange = (event)=> {
    const value = event.target.value;

    if (RegExes.POSITIVE_INTEGER.test(value)) {
      this.setImmState(d => d.set('value', parseInt(value, 10)));

      const { onQuantityChange } = this.props;
      if (typeof onQuantityChange === 'function') {
        onQuantityChange(parseInt(value, 10));
      }
    } else if (value === '') {
      this.setImmState(d => d.set('value', value));
    }
  };

  render() {
    const {} = this.props;
    const { value } = this.state.data.toJS();

    return (
      <div className="Input-quantity">
        <i className="icon ion-ios-remove-circle" onClick={this._handleMinus}/>
        <input className="input-text" value={value} onChange={this._handleChange}/>
        <i className="icon ion-ios-add-circle" onClick={this._handleAdd}/>
      </div>
    );
  }
}
