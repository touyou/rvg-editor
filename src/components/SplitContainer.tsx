import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import CropRotateIcon from '@material-ui/icons/CropRotate';
import ImageIcon from '@material-ui/icons/Image';
import CompareIcon from '@material-ui/icons/Compare';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Home from './Home';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { HomeStore } from 'src/stores/HomeStore';

interface ISplitProps {
    app?: AppStore;
    home?: HomeStore;
}

@inject('app', 'home')
@observer
export default class SplitContainer extends React.Component<ISplitProps> {
    private actions = [
        { icon: <AddIcon />, name: 'Add Image' },
        { icon: <SaveIcon />, name: 'Save Image' },
        { icon: <DeleteIcon />, name: 'Delete All' },
    ]

    public render() {
        const app = this.props.app as AppStore;
        const home = this.props.home as HomeStore;

        return (
            <div style={{
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                overflowY: 'scroll'
            }}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Multi-size Image Editor
                        </Typography>
                        <div style={{ flexGrow: 1 }} />
                        <div>
                            <IconButton color="inherit" onClick={app.selectEditorMode}>
                                <CropRotateIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={app.selectPreviewMode}>
                                <ImageIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={app.selectSplitMode}>
                                <CompareIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <div style={{
                    display: 'flex'
                }}>
                    <Home />
                    <div style={{
                        zIndex: -10,
                        backgroundColor: '#FFECB3',
                        overflowX: 'hidden',
                        height: '100vh',
                        width: this.getPreviewWidth(app.windowMode),
                    }}>
                    </div>
                </div>
                <SpeedDial
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                    }}
                    ariaLabel="File"
                    icon={<SpeedDialIcon />}
                    onClick={home.toggleDialOpen}
                    open={home.isDialOpen}
                >
                    {this.actions.map(action => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={() => this.onClickDialAction(action.name)}
                        />
                    ))}
                </SpeedDial>
            </div >
        )
    }

    public getPreviewWidth = (state: WindowMode) => {
        switch (state) {
            case WindowMode.PREVIEW:
                return '100vw';
            case WindowMode.SPLIT:
                return '50vw';
            default:
                return '0vw';
        }
    }

    public onClickDialAction = (type: string) => {
        const home = this.props.home as HomeStore;

        if (type === this.actions[0].name) {        // Add Image
            home.toggleModalOpen();
        } else if (type === this.actions[1].name) { // Save Image
            /** TODO */
        } else if (type === this.actions[2].name) { // Delete Image
            home.onClickDeleteAllButton();
        }
    }
}