import Editor from '../components/editor';
import EditPanel from '../components/editPanel';
import Preview from '../components/preview';
import { RBF } from '../lib/rbf';
import { NDArray } from '@bluemath/common';
import React from 'react';

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
      <div>
        <p>{testRbf()}</p>
        <Editor></Editor>
        <EditPanel></EditPanel>
        <Preview></Preview>
      </div>
    );
  }
}

export default Main
