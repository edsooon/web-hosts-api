import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Inject from './pages/InjectHosts'
import Manage from './pages/ManageHosts'
import Menu from './pages/Menu'


const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Menu} />
            <Route path="/inject" exact component={Inject} />    
            <Route path="/manage" exact component={Manage} />        
            <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;