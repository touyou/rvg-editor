import Editor from '../components/editor';
import EditPanel from '../components/editPanel';
import Preview from '../components/preview';
import { RBF } from '../lib/rbf';
import { NDArray } from '@bluemath/common';
import React from 'react';
import Head from 'next/head';

function testRbf() {
  let rbf = new RBF();
  let y = new NDArray([
    [3.0],
    [4.0],
    [6.0],
    [2.0]
  ]);
  let A = [
    new NDArray([1.0, 2.0]),
    new NDArray([2.0, 3.0]),
    new NDArray([1.0, 4.0]),
    new NDArray([3.0, 4.0]),
  ];
  let weight = rbf.computeWeights(y, A);
  return (
    <div>
      <p>(2, 3.5): {rbf.interpolate(new NDArray([2.0, 3.5]), A, weight)}</p>
      <p>(1, 0.5): {rbf.interpolate(new NDArray([1.0, 0.5]), A, weight)}</p>
      <p>(3, 4): {rbf.interpolate(new NDArray([3.0, 4.0]), A, weight)}</p>
    </div>
  );
}

class Main extends React.Component {
  render() {
    return (
      <div className='root'>
        <Head>
          <title>My page title</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
        </Head>
        {/* <p>{testRbf()}</p> */}
        <div className='main'>
          <Editor></Editor>
        </div>
        <div className='sidepanel'>
          <Preview></Preview>
          <EditPanel></EditPanel>
        </div>

        <style jsx>{`
        .root {
          margin: 0 auto;
          padding: 0;
          height: 100%;
          display: flex;
          flex-direction: row;
        }
        .main {
          background-color: red;
          flex: 8 1 auto;
        }
        .sidepanel {
          flex: 1 1 auto;

          display: flex;
          flex-direction: column
        }

        .editpanel {
          background-color: green;
          flex: 0 1 auto;
        }
        `}</style>
        <style jsx global>{`
        #__next {
          height: 100vh;
        }
        body {
          margin: 0 auto;
          height: 100vh;
        }
        html {
          height: 100vh;
        }
        `}</style>
      </div>
    );
  }
}

export default Main
