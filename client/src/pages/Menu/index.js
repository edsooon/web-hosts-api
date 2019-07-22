import React, {Component} from 'react';
import "./Menu.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

class App extends Component {

  goToPageInject = () => {     
    this.props.history.push(`/inject`);
  }

  goToPageManage = () => {     
    this.props.history.push(`/manage`);
  }

  render() {
    return (
        <div className="container">
            <div className="box">
                <div className="row">
                    <div className="col-6">
                        <button className="btn btn-primary buttonStyle" onClick={this.goToPageManage}>
                            <i className="fa fa-plus"/>&nbsp;
                            <i className="fa fa-edit"/>&nbsp;
                            <i className="fa fa-trash"/>
                            &nbsp;Manage Hosts
                        </button>
                    </div>
                    <div className="col-6">
                        <link rel="stylesheet" type="text/css" href=""></link>
                        <button onClick={this.goToPageInject} className="btn btn-success buttonStyle"><i className="fa fa-file"/>&nbsp;Inject Hosts</button>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default App;