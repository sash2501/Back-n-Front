import React from 'react';

import { BrowserRouter as Router, Route} from 'react-router-dom';

import Join from './components/Join/Join';
import Call from './components/Call/Call';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/call" exact component={Call} />
    </Router>
  )
};

export default App;