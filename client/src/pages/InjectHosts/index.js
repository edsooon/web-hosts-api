import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./Index.module.css";

export default class Menu extends Component {

  state = { hosts:[], hostsReturn:'', stores:[]};
  selectedHosts = {hosts:[]};
  qtdChekbox = 0;
   
    async componentDidMount() {    
     
        try {
          const res = await this.callApi();
          const resStores = await this.callApiStores();
    
          if (res && resStores) {
            const styleLink = document.createElement("link");
            styleLink.rel = "stylesheet";
            styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
            document.head.appendChild(styleLink);
            this.setState({hosts: res, stores: resStores});
            
          }
        } catch (e) {
          console.log(e);
        }
      }
  
      callApi = async () => {
        const response = await fetch('/hosts/all');       
        const body = await response.json();        
        if (response.status !== 200) throw Error(body.message);
    
        return body;
      };

      callApiStores = async () => {
        const response = await fetch('/stores');       
        const body = await response.json();        
        if (response.status !== 200) throw Error(body.message);
    
        return body;
      };

  callApiInject = async () => {

    var hostsSelected = '';

    for(var i = 0; i < this.qtdChekbox; i++){
      var radio = await document.getElementById('radio'+i);

      if (radio != null && radio.checked){ 
        hostsSelected = hostsSelected.concat(hostsSelected.length === 0 ? 'name='.concat(radio.value) : '&name='.concat(radio.value));
      }
    }
    
    var url = '/hosts/inject?'.concat(hostsSelected);
    const response = await fetch(url);         
    const body = await response.json();
        
    if (response.status !== 200) throw Error(body.message);       
   
    this.setState({hostsReturn: body.hostsReturn});
  
  };

  goToPageHome = () => {     
    this.props.history.push(``);
  }
  
  
  render() {
     
   return (
     <div>
      <div className="card"> 
        <div className="card-header">
            Select Hosts
        </div>
        <div className={" card-body"}>
        {this.state.stores.map((store, key) => 
            
            <div className="card"> 
              <div className="card-header">
              {store.storeId}
              </div>
              <div className={"card-body"}>

              <div className="row">       
                {this.state.hosts.map((item, key) =>           
                   item.storeId === store.storeId &&                   
                   <div className="col-sm-3"> 
                      <div className="ui fitted slider checkbox">
                        <input id={"radio"+key} type="checkbox" value={item.name} defaultChecked={item.setado}/>                                          
                        <label><p hidden>{this.qtdChekbox++}</p></label>
                      </div>
                     <label>&nbsp;&nbsp;{item.name}</label>         
                   </div>                   
                )}
              </div>

              </div>
            </div>
        )}
         
        </div>
        <div className="card-footer">
          <center>              
              <button onClick={this.callApiInject} className="btn btn-success mr-2"><i className="fa fa-check"/>&nbsp;Inject Hosts</button>
              <button onClick={this.goToPageHome}  className="btn btn-info"><i className="fa fa-home"/>&nbsp;Go To Home</button>
          </center>
        </div>
      </div>
      <p/>
      <div className={this.state.hostsReturn === '' ? styles.hidden  : 'card'}> 
        <div className="card-header">
            Hosts
        </div>
        <div className=" card-body">             
              <div className="form-group">  
               <textarea className="form-control rounded-0" id="exampleFormControlTextarea1" rows="20" value={this.state.hostsReturn}></textarea>
              </div>
        </div>
        <div className="card-footer"></div>
      </div>

    </div>

    );
  }
}

