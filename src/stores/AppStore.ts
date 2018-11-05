import { observable, action } from 'mobx';

export enum WindowMode {
  EDITOR,
  PREVIEW,
  SPLIT
}

export class AppStore {
  @observable
  public windowMode: WindowMode = WindowMode.SPLIT;

  @action.bound
  public selectEditorMode() {
    this.windowMode = WindowMode.EDITOR;
  }

  @action.bound
  public selectPreviewMode() {
    this.windowMode = WindowMode.PREVIEW;
  }

  @action.bound
  public selectSplitMode() {
    this.windowMode = WindowMode.SPLIT;
  }
}