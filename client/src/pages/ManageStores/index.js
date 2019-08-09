import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Alert from 'reactstrap/lib/Alert';
import styles from "./Manage.module.css";


export default class Index extends Component {

  state = { store:'', stores:[], open: false, visible: false, statusMessage:[ { color: '', messages: [] } ], edit: false, confirm: false};
  
    async componentDidMount() {    
     
        try {
         
          const resStores = await this.callApiStores();
                        
          if (resStores) {    
            this.setState({stores: resStores});                       
          }
        } catch (e) {
          console.log(e);
        }
      }

     
      callApiStores = async () => {
        const response = await fetch('/stores');       
        const body = await response.json();        
        if (response.status !== 200) throw Error(body.message);
    
        return body;
      };

      updateStore = async () => {

        this.state.store.storeId = document.getElementById('store').value;
               
        const response = await fetch('/stores/'+ this.state.store._id, 
          {
            method: 'PUT',
            body: JSON.stringify(this.state.store),
            headers: {
            'Content-Type': 'application/json'
                                      }
          });
        
          const body = await response.json();         
                         
        if (response.status === 200){
          this.setState({ statusMessage: [ { color: 'success', messages: [ { msg: this.state.store.storeId + ' store successfully edited!' } ] } ] });
          this.onShowAlert(); 
            
        } else { 
              
          const errors = body.message.errors; 
          const errorsMessages = this.getErrors(errors);
          this.setState({ statusMessage: [ { color: 'danger', messages:  errorsMessages} ] });  
          this.onShowAlert(); 
          this.componentDidMount();           
        }

      };

      newStore= async () => {
       
        let data = {
          storeId: document.getElementById('store').value         
        }

        const response = await fetch('/stores/', 
          {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
            'Content-Type': 'application/json'
            }
          });

        const body = await response.json();
        
        if (response.status === 201){          
          
          this.setState({ statusMessage: [ { color: 'success', messages: [ { msg: data.storeId + ' store successfully created!' } ] } ] });         
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

      deleteStore = async () => {
        this.onCloseConfirmDelete();       
        const response = await fetch('/stores/'+ this.state.store._id, 
          {
            method: 'DELETE'
          });

                                                
        if (response.status === 204){          
          this.setState({ statusMessage: [ { color: 'success', messages: [ { msg: this.state.store.idStore + ' store successfully removed!' } ] } ] });   
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
        this.setState({ store: row });
        this.setState({ confirm: true });
      }

      onCloseConfirmDelete = () => {   
        this.setState({ confirm: false });
      }

      newStoreClearFields = () => {   
        document.getElementById('store').value = '';
        
      }
           
      goToPageHome = () => {     
        this.props.history.push(``);
      }

      
  
      cellButton(cell, row, enumObject, rowIndex) {  
     
        return (
          <center>
            <button className='btn btn-primary' title={'Editar ' + row.storeId} type="button" onClick={() => 
              this.onOpenModal(row)}>
              <i className='fa fa-pencil'/>
            </button> {' '}
            <button className='btn btn-danger' title={'Deletar ' + row.storeId} type="button" onClick={() => 
              this.onOpenConfirmDelete(row)}>
              <i className='fa fa-trash'/>
            </button>
          </center>     
        )
      }

      onOpenModal = async (row) => {
        this.setState({ selectValue: row.storeId });  
        this.setState({ store: row });       
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
      };

      setFieldsEdit = () => {
        if(this.state.edit){       
          document.getElementById('store').value = this.state.store.storeId;          
         
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
          <div className="card-header">Stores</div>
          <div className="card-body">
            <BootstrapTable condensed pagination search striped hover data={this.state.stores} version='4'> 
              <TableHeaderColumn isKey={true} hidden dataField="_id">ID</TableHeaderColumn>  
              <TableHeaderColumn dataAlign="center"dataField='storeId'>Store</TableHeaderColumn>
              <TableHeaderColumn width={'10%'} dataAlign="center" dataField='button' dataFormat={this.cellButton.bind(this)}>Action</TableHeaderColumn>
            </BootstrapTable>
          </div>
          <div className="card-footer">
            <center>
                <button className={styles.buttons + " btn btn-success mr-2"} onClick={this.onOpenModalNew}><i className="fa fa-plus"></i> New Store</button>{' '}
                <button className={styles.buttons + " btn btn-primary mr-2"} onClick={this.goToPageHome}><i className="fa fa-home"></i> Go To Home</button>
            </center> 
          </div>
        </div>
     
        <div>       
        <Modal onOpened={this.setFieldsEdit} fade size='lg' centered isOpen={this.state.open} className={this.props.className}>
          <ModalHeader>{this.state.edit ? 'Edit Store' : 'New'}</ModalHeader>
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
                  <label><b>Store</b></label>
                  <input id="store" className="form-control" />   
                </div>                
              </div> 
            </div>
          </form>
          </ModalBody>
          <ModalFooter>
            <button className={!this.state.edit ? styles.buttons + ' btn btn-success' : styles.hidden} onClick={this.newStoreClearFields}><i className="fa fa-plus"></i> New Store</button>{' '}
            <button className={!this.state.edit ? styles.buttons + ' btn btn-primary' : styles.hidden} onClick={this.newStore}><i className="fa fa-save"></i> Save New</button>{' '}
            <button className={this.state.edit ? styles.buttons + ' btn btn-primary' : styles.hidden} onClick={this.updateStore}><i className="fa fa-save"></i> Save</button>{' '}
            <button onClick={this.onCloseModal} className={styles.buttons + " btn btn-secondary"}><i className={"fa fa-remove"}></i> Close</button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
          <Modal fade size='md' centered isOpen={this.state.confirm} className={this.props.className}>
            <ModalHeader>Delete</ModalHeader>
            <ModalBody>
                <label>Do you want to remove store <b>{this.state.store.storeId}</b> ?</label>
            </ModalBody>
            <ModalFooter>
              <Button color="success"   onClick={this.deleteStore}><i className="fa fa-check"></i> Sim</Button>{' '}
              <Button color="secondary" onClick={this.onCloseConfirmDelete}><i className="fa fa-remove"></i> Não</Button>
            </ModalFooter>
          </Modal>
      </div>

      </div>
    )
  }
}

