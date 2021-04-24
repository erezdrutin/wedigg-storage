import React from 'react';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Tooltip from '@material-ui/core/Tooltip';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const styles = theme => ({
    notchedOutline: {
      borderWidth: "1px",
      borderColor: "white"
    }
});
const useStyles = makeStyles(styles);

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

export default function CheckboxesTags(props) {
  const classes = useStyles();
  const { id, getOptionTitle, getOptionDesc, data, fieldName, placeholderName, setValue, tooltipTitle, fieldWidth, disabled} = props;
  return (
    <Tooltip title={tooltipTitle}>
      {disabled ? (
        <Autocomplete
          multiple
          id={id}
          options={data}
          disableCloseOnSelect
          freeSolo
          disabled
          onChange={(event, newVal) => {
            setValue(newVal)
          }}
          getOptionLabel={(option) => getOptionDesc(option)}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {getOptionTitle(option)}
            </React.Fragment>
          )}
          style={{width: fieldWidth}}
          renderInput={(params) => (
            <CssTextField
            {...params}
            variant="outlined"
            label={fieldName}
            placeholder={placeholderName}
            />
          )}
        />
      ) : (
        <Autocomplete
          multiple
          id={id}
          options={data}
          disableCloseOnSelect
          freeSolo
          onChange={(event, newVal) => {
            setValue(newVal)
          }}
          getOptionLabel={(option) => getOptionDesc(option)}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {getOptionTitle(option)}
            </React.Fragment>
          )}
          style={{width: fieldWidth}}
          renderInput={(params) => (
            <CssTextField
            {...params}
            variant="outlined"
            label={fieldName}
            placeholder={placeholderName}
            />
          )}
        />
      )}
    </Tooltip>
  );
}