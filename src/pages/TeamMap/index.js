import React, { Component } from 'react'
import MultiMarkerMap from '../../components/MultiMarkerMap'
import { Link } from 'react-router-dom'
import { getCustomers, getEmployees } from '../../actions'
import { connect } from 'react-redux';


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
      return (
        <div className="person" key={i}>
          <label><input type="checkbox" name={i} onChange={this.props.onPeopleChange} checked={person.displayOnMap} /><span>{person.name}</span></label>
        </div>
      )
    })
    return peopleList;
  }
}

class TeamMapComp extends Component {
  state = {
    customers: this.props.customers,
    employees: this.props.employees
  };

  componentDidUpdate(prevProps) {
    //TODO Needs to be refactor
    //adding customers to state
    if (this.props.customers !== prevProps.customers || this.props.employees !== prevProps.employees) {
      //Is this a anti pattern?
      const customersClone = [...this.props.customers]
      // console.log(customersClone, 'clone', this.props.customers);
      const customers = customersClone.map((customer) => {
        customer.displayOnMap = true;
        customer.showPopover = false;
        customer.type = 'customer'
        return customer;
      })
      const employees = this.props.employees.map((employee) => {
        employee.displayOnMap = true;
        employee.showPopover = false;
        employee.type = 'employee';
        return employee;
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
          <div className="side-header">
            <div className="header-wrap">
              <h2>Customers</h2>
              <div className="key customer"></div>
            </div>
            <hr />
          </div>
          <div className="side-body">
            <PeopleList people={customers} onPeopleChange={(e) => this.handleCheckedChange(e, 'customer')} />
            <Link to="customers/new-customer">
              <button className="btn second-btn btn-success">Add Customer</button>
            </Link>
          </div>
          <div className="side-header">
            <div className="header-wrap">
              <h2>Employess</h2>
              <div className="key employee"></div>
            </div>
            <hr />
          </div>
          <div className="side-body">
            <PeopleList people={employees} onPeopleChange={(e) => this.handleCheckedChange(e, 'employee')} />
            <Link to="customers/new-customer">
              <button className="btn second-btn btn-success">Add Customer</button>
            </Link>
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

