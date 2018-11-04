import * as React from 'react';
import './App.css';
import Home from './components/Home';
import { HomeState } from './stores/HomeStore';
import { Provider } from 'mobx-react';

const store = {
  home: new HomeState(),
};

class App extends React.Component {
  public render() {
    return (
      <Provider {...store}>
        <Home />
      </Provider>
    );
  }
}

export default App;
