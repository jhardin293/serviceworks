import React, { Component } from 'react'
import MultiMarkerMap from '../../components/MultiMarkerMap'
import { getCustomers } from '../../actions'
import { connect } from 'react-redux';

class CustomerList extends Component {
   state = {
    customers: this.props.customers
  };
  componentDidUpdate(prevProps) {
    //adding customers to state
    if (this.props.customers !== prevProps.customers) {
      //Is this a anti pattern?
      this.setState({customers: this.props.customers});
    }
  }
  render() {
    const customers = this.state.customers;
    
    const customerList = customers.map((customer, i) => {
      return (
        <div className="customer" key={i}>
          <label><input type="checkbox" name={i}  onChange={this.props.onCustomerChange} checked={customer.displayOnMap}/><span>{customer.name}</span></label>
        </div>
      )
    })
    return customerList;
  }
}

class TeamMapComp extends Component {
  state = {
    customers: this.props.customers
  };

  componentDidUpdate(prevProps) {
    //adding customers to state
    if (this.props.customers !== prevProps.customers) {
      //Is this a anti pattern?
      const customersClone = [...this.props.customers]
      // console.log(customersClone, 'clone', this.props.customers);
      const customers = customersClone.map((customer) => {
        customer.displayOnMap = true;
        customer.showPopover = false;
        return customer;
      })
      this.setState({customers: customers});
    }
  }
  componentWillMount() {
    this.props.getCustomers();
  }
  onCustomerChange = (e) => {
    const target = e.target;
    const value = target.checked;
    const idx = target.name;
    const customers = this.state.customers;
    customers[idx].displayOnMap = value;

    this.setState({customers});

  }

  resetPopoverState = () => {
    const customers = this.state.customers.map((customer) => {
      customer.showPopover = false;
      return customer;
    });

    this.setState({customers});
  }

  handleMarkerClick = (idx) => {
    const customers = this.state.customers;
    this.resetPopoverState();

    if (customers[idx].showPopover === false) {
      customers[idx].showPopover = true;
    }else {
      customers[idx].showPopover = false;
    }
    this.setState({customers});
  }

  handleOutsideClick = () => {
    this.resetPopoverState();
  }

  render() {
    const customers = this.state.customers;

    return (
      <div className="map-view page-view">
        <div className="map">
          <MultiMarkerMap 
            latLng={{ lat: 37.8145218, lng: -122.2544248 }} 
            items={customers} 
            onMarkerClick={this.handleMarkerClick}
            onOutsideClick={this.handleOutsideClick}

          />
        </div>
        <aside className="side-area">
          <div className="side-header">
            <h2>Customers</h2>
            <hr />
          </div>
          <div className="side-body">
            <CustomerList customers={customers} onCustomerChange={this.onCustomerChange}/>
            <button className="btn second-btn btn-success">Add Customer</button>
          </div>
        </aside>
      </div>
    )
  }
}


const mapNoteStateToProps = state => ({
  customers: state.customers.customers
});
export const TeamMap = connect(mapNoteStateToProps, { getCustomers })(TeamMapComp);

