import * as React from 'react';
import './App.css';
import { HomeStore } from './stores/HomeStore';
import { Provider } from 'mobx-react';
import { ImagesStore } from './stores/ImageCanvasStore';
import SplitContainer from './components/SplitContainer';
import { AppStore } from './stores/AppStore';

const store = {
  app: new AppStore(),
  home: new HomeStore(),
  images: new ImagesStore(),
};

class App extends React.Component {
  public render() {
    return (
      <Provider {...store}>
        <SplitContainer />
      </Provider>
    );
  }
}

export default App;
