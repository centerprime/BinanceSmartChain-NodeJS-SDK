import React, {useState} from 'react';
import axios from 'axios'; 


function Home() {

    
    const [loading, setLoading] = useState(false);
    const password = useFormInput('');
    const [error, setError] = useState(null);
    const [keystore, setKeystore] = useState(null);
   
 // handle button click of login form
 const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://localhost:3080/api/createWallet', { password: password.value }).then(response => {
      console.log(JSON.stringify(response.data));
      setKeystore(JSON.stringify(response.data.keystore));
      setLoading(false);
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }


  return (
    <div>
      Create Wallet<br /><br />
      <div>
        Password<br />
        <input type="text" {...password} autoComplete="new-password" />
      </div>
      <br />
      <input type="button" value={loading ? 'Loading...' : 'Create'} onClick={handleLogin} disabled={loading} /><br /><br />
      Keystore<br />
      <textarea className="form-control"  cols={100} rows={10} value = {keystore}/>
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

export default Home;