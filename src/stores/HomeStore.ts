import { action, observable } from 'mobx';
import { KeyFrame } from './ImageCanvasStore';

export class HomeStore {
    @observable
    public fileName: string | null = null;
    @observable
    public originalImage: HTMLImageElement | null = null;
    @observable
    public isModalOpen: boolean = false;
    @observable
    public isSeamRemove: boolean = false;
    @observable
    public isLoading: boolean = false;
    @observable
    public isDialOpen: boolean = false;
    @observable
    public addWidth: number = 0;
    @observable
    public addHeight: number = 0;

    @observable
    public selectedXKey: KeyFrame | null = null;
    @observable
    public selectedYKey: KeyFrame | null = null;

    @observable
    public isXSet: boolean = true;
    @observable
    public isYSet: boolean = true;

    public toggleXParam(value: boolean) {
        this.isXSet = value;
    }

    public toggleYParam(value: boolean) {
        this.isYSet = value;
    }

    @action.bound
    public toggleModalOpen() {
        this.isModalOpen = !this.isModalOpen;
    }

    @action.bound
    public toggleSeamState() {
        this.isSeamRemove = !this.isSeamRemove;
    }

    @action.bound
    public toggleLoading() {
        this.isLoading = !this.isLoading;
    }

    @action.bound
    public toggleDialOpen() {
        this.isDialOpen = !this.isDialOpen;
    }

    @action.bound
    public onChangeWidth(value: number) {
        this.addWidth = value;
    }

    @action.bound
    public onChangeHeight(value: number) {
        this.addHeight = value;
    }

    @action.bound
    public onClickAddButton(image: HTMLImageElement | null, completion: Function) {
        if (image) {
            this.originalImage = image;
        }
        this.isModalOpen = false;
        completion();
    }

    @action.bound
    public onClickOpenButton(value: string) {
        this.fileName = value;
    }

    public setXKey(value: KeyFrame | null) {
        this.selectedXKey = value;
    }

    public setYKey(value: KeyFrame | null) {
        this.selectedYKey = value;
    }

    public removeImage() {
        this.originalImage = null;
        this.selectedXKey = null;
        this.selectedYKey = null;
    }
}
