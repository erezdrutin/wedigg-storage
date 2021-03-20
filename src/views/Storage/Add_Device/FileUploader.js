import React from 'react';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";


const colorButtonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 55,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    maxWidth: '100%',
    marginTop: '-1px'
};

export default function FileUploader (props) {
    const { btnText, btnIcon } = props;
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };
  return (
    <>
        <Button
        variant="contained"
        color="warning"
        endIcon={<Icon style={{marginTop: '-3px'}}>{btnIcon}</Icon>}
        onClick={handleClick}
        style={colorButtonStyle}
        >
            {btnText}
        </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}}
      />
    </>
  )
};