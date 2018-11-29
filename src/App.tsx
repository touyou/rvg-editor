import * as React from 'react';
import './App.css';
import { HomeStore } from './stores/HomeStore';
import { Provider } from 'mobx-react';
import { KeyFrameStore } from './stores/ImageCanvasStore';
import SplitContainer from './components/SplitContainer';
import { AppStore } from './stores/AppStore';
import { PreviewStore } from './stores/PreviewStore';
import * as Sentry from '@sentry/browser';
import { enableLogging } from 'mobx-logger';

enableLogging();

const store = {
  app: new AppStore(),
  home: new HomeStore(),
  keyFrames: new KeyFrameStore(),
  preview: new PreviewStore()
};

// Log
Sentry.init({
  dsn: 'https://9850d2fa1cef43eda2cf2cd4d65c58ca@sentry.io/1333185'
});

class ExampleBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

class App extends React.Component {
  public render() {
    return (
      <ExampleBoundary>
        <Provider {...store}>
          <SplitContainer />
        </Provider>
      </ExampleBoundary>
    );
  }
}

export default App;
