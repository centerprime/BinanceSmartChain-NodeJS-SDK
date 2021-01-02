import React, {useState} from 'react';
import axios from 'axios'; 


function ImportWallet() {

    
    const [loading, setLoading] = useState(false);
    const password = useFormInput('');
    const [error, setError] = useState(null);
    const keystore = useFormInput('');
    const [result, setResult] = useState(null);
   
 // handle button click of login form
 const handleLogin = () => {
    setError(null);
    setLoading(true);
   let passwordTxt = password.value;
   let keystoreTxt = keystore.value;
   if(passwordTxt === '' || keystoreTxt === ''){
     setLoading(false);
     setError("Please fill the fileds");
   } else {
    axios.post('http://localhost:3080/api/importWallet', { password: password.value, keystore : keystore.value }).then(response => {
      console.log(JSON.stringify(response.data));
      setLoading(false);
      setError("SUCCESS")
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
   }
   
  }


  return (
    <div>
      Keystore<br /><br />
      <textarea className="form-control" {...keystore}  cols={100} rows={10}/>
      <br />
      <div>
        Password<br />
        <br />
        <input type="text" {...password} autoComplete="new-password" />
      </div>
      <br />
      <input type="button" value={loading ? 'Loading...' : 'Import'} onClick={handleLogin} disabled={loading} /><br /><br />
      <p>{error}</p>
    </div>
  );
}
 
const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);
   
    const handleChange = e => {
      setValue(e.target.value);
    }
    return {
      value,
      onChange: handleChange
    }
  }

export default ImportWallet;