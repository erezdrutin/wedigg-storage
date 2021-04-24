import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'black',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'black',
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        },
      },
    },
})(TextField);


export default function AsyncAutoComplete(props) {
    const { label, tooltipTitle, getLabel, loadFunc, setVal, fieldWidth } = props;
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            if (active) {
                setOptions(await loadFunc());
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    return (
    <Tooltip title={tooltipTitle}>
        <Autocomplete
            id={"asynchronous-" + label}
            freeSolo
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => getLabel(option)}
            options={options}
            loading={loading}
            onChange={(event, newVal) => setVal(newVal)}
            style={{width: fieldWidth}}
            renderInput={(params) => (
            <CssTextField
                {...params}
                label={label}
                variant="outlined"
                InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                    </React.Fragment>
                ),
                }}
            />
            )}
        />
    </Tooltip>
    );
}