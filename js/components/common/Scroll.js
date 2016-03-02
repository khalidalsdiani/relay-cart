/**
 * Created by Soon on 9/16/2015.
 */

import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import IScroll from 'iscroll/build/iscroll-lite';

import '!style!css!postcss!sass!./Scroll.scss';
export default class Scroll extends React.Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
    onScrollEnd: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({
        x: 0,
        y: 0,
      }),
    };
  }

  componentDidMount = ()=> {
    this._init();
  };

  componentDidUpdate = (/* prevProps, prevState */)=> {
    this.scroll.refresh();
  };

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  _init = ()=> {
    const self = this;
    const elem = this.refs.Scroll;

    const scrollOption = {
      /* scrollbars: true,*/
      /* mouseWheel: true,*/
      /* interactiveScrollbars: true,*/
      /* shrinkScrollbars: 'scale',*/
      /* fadeScrollbars: true,*/
      /* probeType:1,*/
    };

    if (this.iScrollClick()) {
      scrollOption.click = true;
    }

    const scroll = new IScroll(elem, scrollOption);

    scroll.on('scrollEnd', ()=> {
      self._handleScrollEnd();
    });
    this.scroll = scroll;
    this.scroll.scrollTo(0, 0);
  };

  _handleScrollEnd = ()=> {
    const { onScrollEnd } = this.props;
    if (typeof onScrollEnd === 'function') {
      onScrollEnd(this.scroll);
    }
  };

  iScrollClick = ()=> {
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
      const s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
      return parseFloat(s[0] + s[3]) >= 44;
    }
  };

  componentWillUnmout = ()=> {
    this.scroll.destroy();
  };

  render() {
    const { children } = this.props;
    let {} = this.state.data.toJS();

    return (
      <div className="Scroll" ref="Scroll">
        {children}
      </div>
    );
  }
}
