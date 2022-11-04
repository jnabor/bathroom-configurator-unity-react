import React from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import '../../App.css';

type Props = {
    setSelection: (value: string) => void;
    selection: string;
};

export const Controls = ({ setSelection, selection }: Props) => {
    const handleSelect = (
        _: any,
        selected: string,
    ) => {
        setSelection(selected || "1");
    };

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
                    <ToggleButton id='1' value='1'>
                        SINK 1
                    </ToggleButton>
                    <ToggleButton id='2' value='2'>
                        SINK 2
                    </ToggleButton>
                    <ToggleButton id='3' value='3'>
                        SINK 3
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className='screen'></div>
        </div>
    );
};
