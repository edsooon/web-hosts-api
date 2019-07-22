import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Alert from 'reactstrap/lib/Alert';
import styles from "./Manage.module.css";



export default class Index extends Component {

  state = { hosts:[], host:'', stores:[], open: false, visible: false, statusMessage:[ { color: '', messages: [] } ], edit: false, confirm: false, selectValue: 'select'};
  
    async componentDidMount() {    
     
        try {
          const res = await this.callApi();
          const resStores = await this.callApiStores();
                        
          if (res && resStores) {                   
            this.setState({hosts: res});  
            this.setState({stores: resStores});                       
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

      updateHost = async () => {

        this.state.host.name = document.getElementById('nameHost').value;
        this.state.host.storeId = this.state.selectValue;
        this.state.host.description = document.getElementById('description').value;
        
        const response = await fetch('/hosts/'+ this.state.host._id, 
          {
            method: 'PUT',
            body: JSON.stringify(this.state.host),
            headers: {
            'Content-Type': 'application/json'
                                      }
          });
        
          const body = await response.json();         
                         
        if (response.status === 200){
          this.setState({ statusMessage: [ { color: 'success', messages: [ { msg: 'Host '+ this.state.host.name + ' salvo com Sucesso!' } ] } ] });
          this.onShowAlert(); 
            
        } else { 
              
          const errors = body.message.errors; 
          const errorsMessages = this.getErrors(errors);
          this.setState({ statusMessage: [ { color: 'danger', messages:  errorsMessages} ] });  
          this.onShowAlert(); 
          this.componentDidMount();           
        }

      };

      newHost = async () => {
       
        let data = {
          name: document.getElementById('nameHost').value,
          description: document.getElementById('description').value,
          storeId: this.state.selectValue
        }

        const response = await fetch('/hosts/', 
          {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
            'Content-Type': 'application/json'
            }
          });

        const body = await response.json();
        
        if (response.status === 201){          
          
          this.setState({ statusMessage: [ { color: 'success', messages: [ { msg: 'Host '+ data.name + ' salvo com Sucesso!' } ] } ] });         
          this.onShowAlert();
          this.componentDidMount();
            
        } else {
           
          const errors = body.message.errors; 
          const errorsMessages = this.getErrors(errors);
          this.setState({ statusMessage: [ { color: 'danger', messages:  errorsMessages} ] });  
          this.onShowAlert();            
        }

      };

      getErrors(errors) {     
        const errorsMessages = [];

        for(var e in errors){
          errorsMessages.push( { msg: errors[e].message });
        } 

        return (errorsMessages);
      }

      deleteHost = async () => {
        this.onCloseConfirmDelete();       
        const response = await fetch('/hosts/'+ this.state.host._id, 
          {
            method: 'DELETE'
          });

        
                                        
        if (response.status === 204){          
          this.setState({ statusMessage: [ { color: 'success', messages: [ { msg: 'Host '+ this.state.host.name + ' removido com Sucesso!' } ] } ] });   
          this.onShowAlert();
          this.componentDidMount();
            
        } else {               
          
          const body = await response.json();
          const errors = body.message.errors; 
          const errorsMessages = this.getErrors(errors);
          this.setState({ statusMessage: [ { color: 'danger', messages:  errorsMessages} ] });  
          this.onShowAlert();             
        }

      };

      onOpenConfirmDelete = (row) => {     
        this.setState({ host: row });
        this.setState({ confirm: true });
      }

      onCloseConfirmDelete = () => {   
        this.setState({ confirm: false });
      }

      newHostClearFields = () => {   
        document.getElementById('nameHost').value = '';
        this.setState( {selectValue: 'select'} );
        document.getElementById('description').value = '';
      }
           
      goToPageHome = () => {     
        this.props.history.push(``);
      }

      
  
      cellButton(cell, row, enumObject, rowIndex) {  
     
        return (
          <center>
            <button className='btn btn-primary' title={'Editar ' + row.name} type="button" onClick={() => 
              this.onOpenModal(row)}>
              <i className='fa fa-pencil'/>
            </button> {' '}
            <button className='btn btn-danger' title={'Deletar ' + row.name} type="button" onClick={() => 
              this.onOpenConfirmDelete(row)}>
              <i className='fa fa-trash'/>
            </button>
          </center>     
        )
      }

      onOpenModal = async (row) => {
        this.setState({ selectValue: row.storeId });  
        this.setState({ host: row });       
        this.setState({ open: true });        
        this.setState({ edit: true });                
      };

      onOpenModalNew = async (row) => { 
        this.setState({ open: true });        
        this.setState({ edit: false });                
      };

      onCloseModal = () => {
        this.setState({ open: false });
        this.setState({ edit: false });
        this.setState({ selectValue: 'select' });
      };

      setFieldsEdit = () => {
        if(this.state.edit){       
          document.getElementById('nameHost').value = this.state.host.name;          
          document.getElementById('description').value = this.state.host.description;
        }
      };

      onShowAlert = ()=>{
        this.setState({visible:true},()=>{
          window.setTimeout(()=>{
            this.setState({visible:false})
          },5000)
        });
      }

      onChange(e) {        
        this.setState({
          selectValue: e.target.value
        })
      }
    
  render () {
    
    return (      
     <div> 

        <div className="card">
          <div className="card-header">Hosts</div>
          <div className="card-body">
            <BootstrapTable condensed pagination search striped hover data={this.state.hosts} version='4'> 
              <TableHeaderColumn isKey={true} hidden dataField="_id">ID</TableHeaderColumn>             
              <TableHeaderColumn dataAlign="center" dataField='name'>Host Name</TableHeaderColumn>              
              <TableHeaderColumn dataAlign="center" width={'30%'} dataField='storeId'>Store</TableHeaderColumn>
              <TableHeaderColumn width={'10%'} dataAlign="center" dataField='button' dataFormat={this.cellButton.bind(this)}>Action</TableHeaderColumn>
            </BootstrapTable>
          </div>
          <div className="card-footer">
            <center>
                <button className={styles.buttons + " btn btn-success mr-2"} onClick={this.onOpenModalNew}><i className="fa fa-plus"></i> Novo Host</button>{' '}
                <button className={styles.buttons + " btn btn-primary mr-2"} onClick={this.goToPageHome}><i className="fa fa-home"></i> Go To Home</button>
            </center> 
          </div>
        </div>
     
        <div>       
        <Modal onOpened={this.setFieldsEdit} fade size='lg' centered isOpen={this.state.open} className={this.props.className}>
          <ModalHeader>{this.state.edit ? 'Editar' : 'Novo'}</ModalHeader>
          <ModalBody>
          <Alert color={this.state.statusMessage[0].color}  isOpen={this.state.visible} >
            {this.state.statusMessage[0].messages.map((item, key) =>
                   <div className="row">
                      <label>{'• ' + item.msg}<br/></label>
                   </div>
              )}             
          </Alert>
          <form>
            <div className="row">
              <div className="col-sm-8">
                <div className="form-group">
                  <label><b>Name Host</b></label>
                  <input id="nameHost" className="form-control" />   
                </div>                
              </div> 

              <div className="col-sm-4">
                <div className="form-group">
                  <label><b>Store</b></label>
                  <select value={this.state.selectValue} id="store" onChange={this.onChange.bind(this)} className="form-control">
                     <option value="select">Select an Option</option>
                     {this.state.stores.map((item, key) =>
                          <option value={item.storeId}>{item.storeId}</option>
                     )}                     
                  </select>   
                </div>                
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label><b>Host</b></label>
                  <textarea  id="description" rows="5" className="form-control"/>   
                </div>                
              </div>
            </div>
          </form>
          </ModalBody>
          <ModalFooter>
            <button className={!this.state.edit ? styles.buttons + ' btn btn-success' : styles.hidden} onClick={this.newHostClearFields}><i className="fa fa-plus"></i> New Host</button>{' '}
            <button className={!this.state.edit ? styles.buttons + ' btn btn-primary' : styles.hidden} onClick={this.newHost}><i className="fa fa-save"></i> Save New</button>{' '}
            <button className={this.state.edit ? styles.buttons + ' btn btn-primary' : styles.hidden} onClick={this.updateHost}><i className="fa fa-save"></i> Save</button>{' '}
            <button onClick={this.onCloseModal} className={styles.buttons + " btn btn-secondary"}><i className={"fa fa-remove"}></i> Close</button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
          <Modal fade size='md' centered isOpen={this.state.confirm} className={this.props.className}>
          <ModalHeader>Delete</ModalHeader>
          <ModalBody>
                <label>Deseja remover o host <b>{this.state.host.name}</b> ?</label>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.deleteHost}><i className="fa fa-check"></i> Sim</Button>{' '}
            <Button color="secondary" onClick={this.onCloseConfirmDelete}><i className="fa fa-remove"></i> Não</Button>
          </ModalFooter>
        </Modal>

      </div>

      </div>
    )
  }
}

