import React, { Component } from 'react';
import stylesHome from "./Menu.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

class App extends Component {

  goToPageInject = () => {
    this.props.history.push(`/inject`);
  }

  goToPageManage = () => {
    this.props.history.push(`/manage`);
  }

  goToPageStores = () => {
    this.props.history.push(`/stores`);
  }

  render() {
    return (
      <div className={stylesHome.container}>
        <div className={stylesHome.box}>
          <div className={stylesHome.boxtransparent + " card"}>
            <div class={stylesHome.boxtransparent + " card-body"}>

              <div className="row">
                <div className="col-sm-12">
                  <button className="btn btn-danger buttonStyle" onClick={this.goToPageStores}>
                    <i className="fa fa-plus" />&nbsp;
                            <i className="fa fa-edit" />&nbsp;
                            <i className="fa fa-trash" />
                    &nbsp;Manage Stores
                        </button>
                </div>
              </div>
              <p />
              <div className="row">
                <div className="col-sm-12">
                  <button className="btn btn-primary buttonStyle" onClick={this.goToPageManage}>
                    <i className="fa fa-plus" />&nbsp;
                            <i className="fa fa-edit" />&nbsp;
                            <i className="fa fa-trash" />
                    &nbsp;Manage Hosts
                        </button>
                </div>
              </div>
              <p />
              <div className="row">
                <div className="col-sm-12">
                  <link rel="stylesheet" type="text/css" href=""></link>
                  <button onClick={this.goToPageInject} className="btn btn-success buttonStyle"><i className="fa fa-file" />&nbsp;Inject Hosts</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;