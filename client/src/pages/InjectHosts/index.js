import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./Index.module.css";

export default class Menu extends Component {

  state = { hosts:[], hostsReturn:''};
  selectedHosts = {"hosts":[]};
   
    async componentDidMount() {    
     
        try {
          const res = await this.callApi();
    
          if (res) {
            const styleLink = document.createElement("link");
            styleLink.rel = "stylesheet";
            styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
            document.head.appendChild(styleLink);
            this.setState({hosts: res});
            
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
     


    selectHost(param){

     var exist = false;

     if(this.selectedHosts.hosts.length === 0){
       this.selectedHosts.hosts.push({"name": param});
     } else {

      for(var h in this.selectedHosts.hosts){
                
        if(this.selectedHosts.hosts[h].name === param){          
          delete this.selectedHosts.hosts[h];
          exist = true;
        } 
      }

      if(!exist){
        this.selectedHosts.hosts.push({"name": param});
      }      

     }    
  }

  callApiInject = async () => {

    var hostsSelected = '';
    
    for(var h in this.selectedHosts.hosts){
      hostsSelected = hostsSelected.concat(hostsSelected.length === 0 ? 'name='.concat(this.selectedHosts.hosts[h].name) : '&name='.concat(this.selectedHosts.hosts[h].name));
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
            Selecionar Hosts
        </div>
        <div className={styles.container+" card-body"}>
          <div className="row">       
             {this.state.hosts.map((item, key) =>           
               
               <div className="col-sm-3"> 
                  <div className="ui fitted slider checkbox" onClick={()=>this.selectHost(item.name)}>
                     <input id={"radio"+key} type="checkbox" />                   
                     <label></label>
                  </div>
                  <label>&nbsp;&nbsp;{item.name}</label>         
               </div> 

            )}
          </div>
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

