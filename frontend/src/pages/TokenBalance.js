import React, {useState} from 'react';
import axios from 'axios'; 


function TokenBalance() {

    
    const [loading, setLoading] = useState(false);
    const address = useFormInput('');
    const tokenAddress = useFormInput('');
    const [error, setError] = useState(null);
   
 // handle button click of login form
 const handleLogin = () => {
    setError(null);
    setLoading(true);
   let addressTxt = address.value;
   let tokenAddressTxt = tokenAddress.value;
   if(addressTxt === '' || tokenAddressTxt === ''){
     setLoading(false);
     setError("Please fill the fileds");
   } else {
    axios.post('http://localhost:3080/api/tokenBalance', { address: address.value }).then(response => {
      console.log(JSON.stringify(response.data));
      setLoading(false);
      setError(response.data)
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
   }
   
  }

  return (
    <div>
      <div>
        Address<br />
        <br />
        <input type="text" {...address} autoComplete="new-password" />
      </div>
      <div>
        Token Address<br />
        <br />
        <input  type="text" {...tokenAddress} autoComplete="new-password" />
      </div>
      <br />
      <input type="button" value={loading ? 'Loading...' : 'Check'} onClick={handleLogin} disabled={loading} /><br /><br />
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

export default TokenBalance;