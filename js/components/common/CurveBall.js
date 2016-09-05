/**
 * Created by Soon on 11/18/2015.
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import Ball from './Ball';

import './CurveBall.scss';

export default class CurveBall extends React.Component {

  static propTypes = {
    colorOfBall: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,

    onStepEnd: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({}),
    };
    this.start = null;
    this.animationQueue = [];
  }

  componentDidMount() {
    const { canvas } = this.refs;
    const { radius, colorOfBall } = this.props;
    const canvasDOM = ReactDOM.findDOMNode(canvas);
    this.ctx = canvasDOM.getContext('2d');
    this.ball = new Ball(this.ctx, radius, colorOfBall);
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  cleanRect = ()=> {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  };

  isAllAnimationEnd = ()=>
    this.animationQueue.every((animation)=> !animation || animation.progress >= 1);

  drawBezierSplit = (ball, x0, y0, x1, y1, x2, y2, t0, t1)=> {
    // reference http://www.pjgalbraith.com/drawing-animated-curves-javascript/
    if (t0 === 0.0 && t1 === 1.0) {
      ball.draw(x2, y2);
    } else if (t0 !== t1) {
      let t00 = t0 * t0;
      let t01 = 1.0 - t0;
      let t02 = t01 * t01;
      let t03 = 2.0 * t0 * t01;

      t00 = t1 * t1;
      t01 = 1.0 - t1;
      t02 = t01 * t01;
      t03 = 2.0 * t1 * t01;

      const nx2 = t02 * x0 + t03 * x1 + t00 * x2;
      const ny2 = t02 * y0 + t03 * y1 + t00 * y2;

      ball.draw(nx2, ny2);
    }
  };

  animatePathDrawing = ()=> {
    const { onStepEnd } = this.props;
    const self = this;

    const step = function animatePathDrawingStep(timestamp) {
      // Clear canvas
      self.cleanRect();

      for (let i = 0; i < self.animationQueue.length; ++i) {
        if (self.animationQueue[i]) {
          const animation = self.animationQueue[i];
          const delta = timestamp - animation.start;
          const progress = Math.min(delta / animation.duration, 1);

          // Draw curve
          self.drawBezierSplit(self.ball,
            animation.startX, animation.startY,
            animation.controlX, animation.controlY,
            animation.endX, animation.endY,
            0, progress);

          if (progress === 1) {
            // release animation when step end
            self.animationQueue[i] = undefined;
            if (typeof onStepEnd === 'function') onStepEnd();
          } else {
            animation.progress = progress;
          }
        }
      }

      if (self.isAllAnimationEnd()) {
        self.cleanRect();
      } else {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  animateCurveBallMoving = (startX, startY, controlX, controlY, endX, endY, duration)=> {
    const isAllAnimationEnd = this.isAllAnimationEnd();

    this.animationQueue.push({
      progress: 0,
      start: window.performance.now(),
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      duration,
    });

    if (isAllAnimationEnd) {
      this.animatePathDrawing();
    }
  };

  render() {
    const { width, height } = this.props;

    return (
      <canvas id="canvas" className="CurveBall" width={width} height={height} ref="canvas"/>
    );
  }
}
