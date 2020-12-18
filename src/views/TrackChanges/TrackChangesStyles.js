const styles = theme => ({
    search: {
      "& > div": {
        marginTop: "0"
      },
      [theme.breakpoints.down("sm")]: {
        margin: "10px 15px !important",
        float: "none !important",
        paddingTop: "1px",
        paddingBottom: "1px",
        padding: "0!important",
        width: "60%",
        marginTop: "40px",
        "& input": {
          color: 'white'
        }
      }
    },
    searchButton: {
      [theme.breakpoints.down("sm")]: {
        top: "-50px !important",
        marginRight: "22px",
        float: "right"
      }
    },
    searchWrapper: {
      searchIcon: {
        width: "17px",
        zIndex: "4"
      },
      [theme.breakpoints.down("sm")]: {
        width: "-webkit-fill-available",
        margin: "10px 15px 0"
      },
      display: "inline-block",
      marginTop: theme.spacing(-2),
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(4)
    },
    cardCategoryWhite: {
      "&,& a,& a:hover,& a:focus": {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
      },
      "& a,& a:hover,& a:focus": {
        color: "#FFFFFF"
      }
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
      "& small": {
        color: "#777",
        fontSize: "65%",
        fontWeight: "400",
        lineHeight: "1"
      }
    }
  })
  export default styles;