import React, { useCallback } from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Tooltip from '@mui/material/Tooltip';

import '../../App.css';

type Props = {
    takeScreenshot: any;
    requestFullscreen: any;
    setSelection: any;
    sendMessage: any;
    selection: string;
};

export const Controls = ({
    requestFullscreen,
    takeScreenshot,
    setSelection,
    sendMessage,
    selection,
}: Props) => {
    const handleScreenshot = useCallback(() => {
        const data = takeScreenshot('image/jpg', 0.9);

        if (data) {
            const image = new Image(960, 600);
            image.src = data;
            const show = window.open('', 'popup', 'width=976,height=618');
            show && show.document.write(image.outerHTML);
        } else {
            console.log('no data');
        }
    }, [takeScreenshot]);

    const handleFullscreen = useCallback(() => {
        requestFullscreen(true);
    }, [requestFullscreen]);

    const handleSelect = useCallback(
        (event: React.MouseEvent<HTMLElement>, selected: string) => {
            setSelection(selected);
            sendMessage('Button-1', 'SetFixture', selected);
        },
        [setSelection, sendMessage],
    );

    return (
        <div className='controls'>
            <div className='selector'>
                <ToggleButtonGroup
                    color='primary'
                    value={selection}
                    exclusive
                    onChange={handleSelect}
                    aria-label='Platform'
                >
                    <ToggleButton value='1'>SINK 1</ToggleButton>
                    <ToggleButton value='2'>SINK 2</ToggleButton>
                    <ToggleButton value='3'>SINK 3</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className='screen'>
                <div className='screen-control-wrapper'>
                    <Tooltip title='Take Screenshot'>
                        <IconButton
                            onClick={handleScreenshot}
                            color='primary'
                            aria-label='take screenshot'
                            component='label'
                        >
                            <PhotoCameraIcon />
                        </IconButton>
                    </Tooltip>
                </div>

                <div className='screen-control-wrapper'>
                    <Tooltip title='Enter Fullscreen'>
                        <IconButton
                            onClick={handleFullscreen}
                            color='primary'
                            aria-label='enter fullscreen'
                            component='label'
                        >
                            <FullscreenIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
