import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import fire from '../../fire.js';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function AsyncAutoComplete() {
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
            const db = fire.firestore();

            db.collection('sites').get().then((querySnapshot) => {
                var tempArr = [];
                // Storing all the sites from the db in an array:
                querySnapshot.forEach((doc) => {
                var data = doc.data();
                var curSite = {
                    id: doc.id,
                    siteName: data.siteName,
                    siteLocation: data.siteLocation,
                    storagesArr: data.storagesArr
                }
                tempArr.push(curSite);
                })
                console.log("AYOOO WADUUUP EREZ HERE LOLZ: ", tempArr);
                setOptions(tempArr);
            })
        }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.siteName}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
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
  );
}