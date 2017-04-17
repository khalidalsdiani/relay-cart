/**
 * Created by Soon on 2/22/16.
 */
import React from 'react';
import PropTypes from 'prop-types';


/* import base styles */
import 'normalize.css/normalize.css';
import './styles/animations.scss';
import './styles/icons.scss';
import 'ionicons/dist/scss/ionicons.scss';
import './styles/shape.scss';

/* import common styles */
import './styles/common.scss';
import './styles/entries.scss';

class App extends React.Component {

  static propTypes = {
    children: PropTypes.element,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const { router } = this.context;
    const { children } = this.props;

    if (!children) {
      router.push('/product-list');
      return null;
    }
    return children;
  }
}

export default App;
