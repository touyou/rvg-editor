import * as React from 'react';
import './App.css';
import Home from './components/Home';
import { HomeState } from './stores/HomeStore';
import { Provider } from 'mobx-react';
import ImageCanvasStore from './stores/ImageCanvasStore';

const store = {
  home: new HomeState(),
  imageCanvas: new Array<ImageCanvasStore>(),
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
