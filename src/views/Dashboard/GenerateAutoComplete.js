import React from "react";
import useStyles from "./NewCardStyles.js";
import { TextField, FormControl, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

export default function GenerateAutoComplete(props) {
    const classes = useStyles();
    const { acID, valuesArr, isMultiple, handleSetNewVal, tfLabel, isDisabled } = props;

    /**
     * A function in charge of returning a label (which will be presented in the AutoComplete TextField) that represents a certain option.
     * @param {{*}} option - An option ({} / [] / string) representing a field.
     */
    const retrieveOptionLabel = (option) => {
        if (acID.includes("site")){
            return option.site;
        } else if (acID.includes("owner")){
            return option.fullName;
        } else {
            return option;
        }
    }

    /**
     * A function in charge of returning a label (which will be presented in the AutoComplete dropdown list) that represents a certain option.
     * @param {{*}} option - An option ({} / [] / string) representing a field.
     */
    const retrieveOptionLabelList = (option) => {
        if (acID.includes("site")){
            return option.site;
        } else if (acID.includes("owner")){
            return option.fullName + " | " + option.email.split("@")[0] + "@...";
        } else {
            return option;
        }
    }

    return (
        <React.Fragment>
            {
                <FormControl variant="standard" className={classes.formControlAutoComplete}>
                    <Autocomplete
                        multiple={isMultiple}
                        limitTags={1}
                        key={valuesArr.length}
                        disabled={isDisabled}
                        id={acID}
                        options={valuesArr}
                        onChange={(event, newVal) => {handleSetNewVal(newVal)}}
                        disableCloseOnSelect
                        freeSolo
                        getOptionLabel={(option) => retrieveOptionLabel(option)}
                        renderOption={(option, { selected }) => (
                        <React.Fragment>
                            <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            />
                            {
                                retrieveOptionLabelList(option)
                            }
                        </React.Fragment>
                        )}
                        renderInput={(params) => (
                        <TextField {...params} variant="standard" size="small" label={tfLabel} placeholder=""/>
                        )}
                    />
                </FormControl>
            }
            
        </React.Fragment>
    )
}