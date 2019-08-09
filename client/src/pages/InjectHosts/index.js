import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./Index.module.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Alert from 'reactstrap/lib/Alert';

export default class Menu extends Component {

  state = { hosts:[], hostsReturn:'', stores:[], open: false, visible: false, statusMessage:[ { color: '', messages: [] } ]};
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
    
    this.setState({ statusMessage: [ { color: 'success', messages: [ { msg: 'Hosts successfully injected!' } ] } ] });   
    this.setState({hostsReturn: body.hostsReturn});
    this.onOpenModal();
    this.onShowAlert();
  
  };

  onShowAlert = ()=>{
    this.setState({visible:true},()=>{
      window.setTimeout(()=>{
        this.setState({visible:false})
      },5000)
    });
  }

  goToPageHome = () => {     
    this.props.history.push(``);
  }


  onOpenModal = async (row) => {  
    this.setState({ open: true });   
  };

  onCloseModal = () => {
    this.setState({ open: false });           
  };
  
  
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
              <div className="card bg-dark text-white card-header">
              <b>{store.storeId}</b>
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
              <button onClick={this.callApiInject} className={styles.buttons + " btn btn-success mr-2"}><i className="fa fa-check"/>&nbsp;Inject Hosts</button>
              <button onClick={this.goToPageHome}  className={styles.buttons + " btn btn-primary"}><i className="fa fa-home"/>&nbsp;Go To Home</button>
          </center>
        </div>
      </div>
      <p/>

      <Modal fade size='lg' centered isOpen={this.state.open} className={this.props.className}>
          <ModalHeader>{'Hosts Injetcted'}</ModalHeader>
          <ModalBody>
          <Alert color={this.state.statusMessage[0].color}  isOpen={this.state.visible} >
            {this.state.statusMessage[0].messages.map((item, key) =>
                   <div className="row">
                      <label>{'• ' + item.msg}<br/></label>
                   </div>
              )}             
          </Alert>
          <form>
            <div className="form-group">  
               <textarea className="form-control rounded-0" id="exampleFormControlTextarea1" rows="20" value={this.state.hostsReturn}></textarea>
            </div>
          </form>
          </ModalBody>
          <ModalFooter>            
            <button onClick={this.onCloseModal} className={styles.buttons + " btn btn-secondary"}><i className={"fa fa-remove"}></i> Close</button>
          </ModalFooter>
        </Modal>

    </div>

    );
  }
}

