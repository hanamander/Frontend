import React, { Component } from 'react';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 1;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

const calcNames = [
    "EQ1",
    "EQ2",
    "EQ3",
    "EQ4",
    "EQ5",
    "EQ6",
];

export default class MeasureSelect extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
        };
    }

    componentDidMount()
    {
        const { eq } = this.props;
        this.setState({ eq: eq });
    }

    handleChange = (event) =>
    {
        const { target: { value } } = event;

        const { handleUpdate } = this.props;
        handleUpdate(value);
    };

    render()
    {
        const { start, eq } = this.props;

        return (
            <div>
                <FormControl sx={{ my: 1, width: 200 }}>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        disabled={start}
                        multiple
                        value={eq}
                        onChange={this.handleChange}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        size="small"
                        padding={1}
                    >
                        {
                            calcNames.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={eq.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
        );
    }
}

