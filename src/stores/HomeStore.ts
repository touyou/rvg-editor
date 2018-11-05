import { action, observable } from 'mobx';
import { ContainerProps } from '../components/ImageCanvas';

export class HomeState {
    @observable
    public imageCanvas: Array<ContainerProps> = [];
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
    public onClickAddButton(image?: HTMLImageElement) {
        if (image) {
            this.originalImage = image;
            this.imageCanvas.push(
                new ContainerProps(this.originalImage, this.addWidth,
                    this.originalImage!.naturalHeight, this.isSeamRemove
                ));
        } else {
            this.imageCanvas.push(
                new ContainerProps(this.originalImage!, this.addWidth,
                    this.originalImage!.naturalHeight, this.isSeamRemove
                ));
        }
        this.isModalOpen = false;
    }

    @action.bound
    public onClickOpenButton(value: string) {
        this.fileName = value;
    }

    @action.bound
    public onClickDeleteAllButton() {
        this.imageCanvas = [];
    }
}
