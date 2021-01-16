import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    horDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        float: 'left',
        marginLeft: theme.spacing(1),
    },
    root: {
      flexGrow: 1,
      maxWidth: '75%',
    },
    textField: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    margin: {
        margin: theme.spacing(1),
    },
    dialogPaper: {
        height: '65vh',
        width: '70vh',
        textAlign: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '88%',
    },
    formControlSecondInSelectRow: {
        margin: theme.spacing(1),
        width: '115%',
    },
    formControlSelect:{
        margin: theme.spacing(1),
        width: '60%',
    },
    formControlAutoComplete:{
        margin: theme.spacing(1),
        width: '88%'
    },
    formControlSecondSelect:{
        margin: theme.spacing(1),
        width: '100%'
    },
    plusButton: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(-9),
        marginRight: theme.spacing(7),
    },
    secondPlusButton: {
        marginLeft: theme.spacing(3.5), 
    },
    selectGridItem: {
        marginRight: theme.spacing(-5),
    }
  }),
);

export default useStyles;
