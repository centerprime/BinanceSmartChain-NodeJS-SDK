import React, {useState} from 'react';
import axios from 'axios'; 


function SendToken() {
    const password = useFormInput('');
    const keystore = useFormInput('');
    const tokenContractAddress = useFormInput('');
    const toAddress = useFormInput('');
    const amount = useFormInput('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
 // handle button click of login form
 const handleLogin = () => {
    setError(null);
    setLoading(true);
   let passwordT = password.value;
   let keystoreT = keystore.value;
   let toAddressT = toAddress.value;
   let amountT = amount.value;
   let tokenContractAddressT = tokenContractAddress.value
   if(passwordT === '' || keystoreT === '' || toAddressT === '' || amountT === '' || tokenContractAddressT === ''){
     setLoading(false);
     setError("Please fill the fileds");
   } else {
    axios.post('http://localhost:3080/api/sendToken', { 
        keystore: keystoreT,
        password: passwordT,
        tokenContractAddress : tokenContractAddressT,
        toAddress : toAddressT,
        amount : amountT
    }).then(response => {
      console.log(JSON.stringify(response.data));
      setLoading(false);
      setError(response.data.transactionHash)
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
   }
   
  }


  return (
    <div>
      Keystore<br />
      <textarea className="form-control" {...keystore}  cols={100} rows={10}/>
      <br />
      <div>
        Password<br />
        <input type="text" {...password} autoComplete="new-password" />
      </div>
      <br />
      <div>
        Token Contract Address<br />
        <input type="text" {...tokenContractAddress} autoComplete="new-password" />
      </div>
      <br />
      <div>
        To Address<br />
        <input type="text" {...toAddress} autoComplete="new-password" />
      </div>
      <br />
      <div>
        Amount<br />
        <input type="text" {...amount} autoComplete="new-password" />
      </div>
      <br />
      <input type="button" value={loading ? 'Loading...' : 'Send'} onClick={handleLogin} disabled={loading} /><br /><br />
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

export default SendToken;