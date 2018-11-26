import * as React from 'react';
import './App.css';
import { HomeStore } from './stores/HomeStore';
import { Provider } from 'mobx-react';
import { KeyFrameStore } from './stores/ImageCanvasStore';
import SplitContainer from './components/SplitContainer';
import { AppStore } from './stores/AppStore';
import { PreviewStore } from './stores/PreviewStore';

const store = {
  app: new AppStore(),
  home: new HomeStore(),
  keyFrames: new KeyFrameStore(),
  preview: new PreviewStore()
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
