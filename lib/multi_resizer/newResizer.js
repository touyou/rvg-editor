import { RBF } from '../rbf';
import { BaseResizer } from './multiResizer';

export class RbfResizer extends BaseResizer {
  constructor() {
    super();
    this.rbf = new RBF();
  }
}
