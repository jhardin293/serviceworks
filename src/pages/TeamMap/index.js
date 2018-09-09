import React, { Component } from 'react'
import MultiMarkerMap from '../../components/MultiMarkerMap'
import { Link } from 'react-router-dom'
import { getCustomers, getEmployees } from '../../actions'
import { connect } from 'react-redux';
import employeeMarker from '../../images/employee-map-marker.svg'
import customerMarker from '../../images/customer-map-marker.svg'
import plus from '../../images/plus.svg'

class PeopleList extends Component {
  state = {
    people: this.props.people
  };
  componentDidUpdate(prevProps) {
    //adding customers to state
    if (this.props.people !== prevProps.people) {
      //Is this a anti pattern?
      this.setState({ people: this.props.people });
    }
  }
  render() {
    const people = this.state.people;

    const peopleList = people.map((person, i) => {
      if (person.displayOnMap) {
        return (
          <div className="person" key={i}>
            <label><input type="checkbox" name={i} onChange={this.props.onPeopleChange} checked={person.displayOnMap} /><span>{person.name}</span></label>
          </div>
        )
      }else {
        return (null)
      }
    })
    return peopleList;
  }
}

class TeamMapComp extends Component {
  state = {
    customers: this.props.customers,
    showAllcustomers: true,
    showAllemployees: true,
    employees: this.props.employees
  };

  componentDidUpdate(prevProps) {
    //TODO Needs to be refactor
    //adding customers to state
    if (this.props.customers !== prevProps.customers || this.props.employees !== prevProps.employees) {
      //Is this a anti pattern?
      const customers = this.props.customers.map((customer) => {
        let customerClone = {...customer};
        customerClone.displayOnMap = true;
        customerClone.showPopover = false;
        customerClone.type = 'customer'
        return customerClone;
      })
      const employees = this.props.employees.map((employee) => {
        let employeeClone = {...employee};
        employeeClone.displayOnMap = true;
        employeeClone.showPopover = false;
        employeeClone.type = 'employee';
        return employeeClone;
      })
      this.setState({ customers, employees });
    }

  }
  componentWillMount() {
    this.props.getCustomers();
    this.props.getEmployees();
  }


  handleCheckedChange = (e, type) => {
    const target = e.target;
    const value = target.checked;
    const idx = target.name;
    const stateItem = type + 's';
    const item = this.state[stateItem];
    item[idx].displayOnMap = value;
    
    console.log(stateItem, 'state Item');
    this.setState({ stateItem });
  }

  resetPopoverState = () => {
    //This can be simplifyed
    const customers = this.state.customers.map((customer) => {
      customer.showPopover = false;
      return customer;
    });
    const employees = this.state.employees.map((employee) => {
      employee.showPopover = false;
      return employee;
    });

    this.setState({ customers, employees });
  }

  handleMarkerClick = (person) => {
    const type = person.type;
    const stateItem = type + 's';
    const items = this.state[stateItem];
    const idx = items.findIndex((item) => {
      return item.id === person.id;
    })
    this.resetPopoverState();

    if (items[idx].showPopover === false) {
      items[idx].showPopover = true;
    } else {
      items[idx].showPopover = false;
    }

    this.setState({ stateItem });
  }

  handleAllSelectedToggle = (e, type) => {
    const value =  e.target.checked;
    const stateItem = type;
    const showAllSubject = "showAll" + type ;
    const subject = this.state[stateItem].map((item)=> {
      //Clone to prevent state mutation
      let itemClone = {...item};
      itemClone.displayOnMap = value;
      return itemClone;
    });
    this.setState({ [showAllSubject] : value, [type]: subject});
  }

  handleOutsideClick = () => {
    this.resetPopoverState();
  }

  render() {
    const customers = this.state.customers;
    const employees = this.state.employees;
    const people = [...customers, ...employees];
    return (
      <div className="map-view page-view">
        <div className="map">
          <MultiMarkerMap
            latLng={{ lat: 37.8145218, lng: -122.2544248 }}
            items={people}
            onMarkerClick={this.handleMarkerClick}
            onOutsideClick={this.handleOutsideClick}

          />
        </div>
        <aside className="side-area">
          <div className="side-group"> 
            <div className="side-header">
              <div className="header-wrap">
                <input type="checkbox"  onChange={(e) => this.handleAllSelectedToggle(e,'customers')} checked={this.state.showAllcustomers} />
                <img src={customerMarker} alt="customer Marker"/>
                <h2>Customers</h2>
              </div>
              <hr />
            </div>
            <div className="side-body">
              <PeopleList people={customers} onPeopleChange={(e) => this.handleCheckedChange(e, 'customer')} />
              <Link to={{
                pathname: "customers/new-customer",
                state: {
                  redirect: {
                    path: window.location.pathname,
                  },
                }
              }} >
                <button className="customer-btn btn"><img src={plus} alt="" /><span>New customer</span></button>
              </Link>
            </div>
          </div>
          <div className="side-group">
            <div className="side-header">
              <div className="header-wrap">
                <input type="checkbox"  onChange={(e) => this.handleAllSelectedToggle(e,'employees')} checked={this.state.showAllemployees} />
                <img src={employeeMarker} alt="customer Marker"/>
                <h2>Employess</h2>
              </div>
              <hr />
            </div>
            <div className="side-body">
              <PeopleList people={employees} onPeopleChange={(e) => this.handleCheckedChange(e, 'employee')} />
              <Link to={{
                pathname: "employees/new-employee",
                state: {
                  redirect: {
                    path: window.location.pathname,
                  },
                }
              }} >
                <button className="account-btn btn"><img src={plus} alt="" /><span>Add employee</span></button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    )
  }
}


const mapNoteStateToProps = state => ({
  customers: state.customers.customers,
  employees: state.employees.employees
});
export const TeamMap = connect(mapNoteStateToProps, { getCustomers, getEmployees })(TeamMapComp);

