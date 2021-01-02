import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import ImportWallet from './pages/ImportWallet';
import BnbBalance from './pages/BnbBalance';
import TokenBalance from './pages/TokenBalance';
import SendBnb from './pages/SendBnb';
import SendToken from './pages/SendToken';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink exact activeClassName="active" to="/">Create Wallet</NavLink>
            <NavLink activeClassName="active" to="/import_wallet">Import Wallet</NavLink>
            <NavLink activeClassName="active" to="/bnb_blanace">Bnb Balance</NavLink>
            <NavLink activeClassName="active" to="/token_balance">Token Balance</NavLink>
            <NavLink activeClassName="active" to="/send_bnb">Send Bnb</NavLink>
            <NavLink activeClassName="active" to="/send_token">Send Token</NavLink>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/import_wallet" component={ImportWallet} />
              <Route exact path="/bnb_blanace" component={BnbBalance} />
              <Route exact path="/token_blanace" component={TokenBalance} />
              <Route exact path="/send_bnb" component={SendBnb} />
              <Route exact path="/send_token" component={SendToken} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
