import moment from 'moment'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Link, Redirect } from 'react-router-dom'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { LocationSearchInput } from '../components/LocationSearchInput'
import {getJobByEmployee} from '../actions';
import { connect } from 'react-redux'
import Map from '../components/Map'


import threeDots from '../images/three-dots.png'

export class EmployeeDetailsComp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      employee: {
        name: props.employee.name,
        email: props.employee.email,
        phone: props.employee.phone,
        role: props.employee.role,
        address: props.employee.address,
        latLng: props.employee.latLng,
        id: props.employee.id || ''
      }
    }
  }

  static propTypes = {
    employee: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    exit: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getJobByEmployee(this.state.employee);
  }
  onChange = (e) => {
    this.setState({ employee: {...this.state.employee,[e.target.name]: e.target.value }});
  }

  getLocation = (address) => {
    this.setState({employee:{...this.state.employee, address}})
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({employee:{...this.state.employee, latLng}})
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    this.setState({employee:{...this.state.employee, address}})
  }

  onSave = () => {
    this.props.onSave(this.state.employee);
  }
  render() {
    const employee = this.state.employee,
      allowDelete = this.props.allowDelete,
      jobs = this.props.jobs.jobsByEmployee;

    
    const jobsList = jobs.map((job,i) => {
      if (job.start.toDate) {
        job.start = job.start.toDate();
        job.end = job.end.toDate();
      }
      const start = moment(job.start),
      end = moment(job.end);


      const duration = moment.duration(end.diff(start)).format("d [days]  h [hours]  m [minutes]");
      return (
        <tr key={i}>
          <td>
            <Link to={{
                pathname: "/schedule/edit-job",
                state: { 
                  redirect: {
                    path: window.location.pathname,
                    employee: this.state.employee,
                    tabIdx: 1
                  },
                  job 
                }
              }} >{job.title}
            </Link>
          </td>
          <td>{start.format('l')} {moment(start).format('LT') } to {moment(end).format('l')} {moment(end).format('LT') } </td>
          <td><b>{duration}</b></td>
          <td>{job.address}</td>
        </tr>
      )
    }) 

    if (this.props.exit === true) {
      return <Redirect to="/my-account/team" />
    }
    return (
      <div className="new-employee-view person-view page-view">
        <div className="page-header">
          <h1>{this.state.employee.name || 'New employee'}</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/my-account/team">
              <button className="btn second-btn btn-cancel ">Cancel</button>
            </Link>
            {allowDelete &&
              <button 
                className="btn second-btn btn-delete" 
                onClick={(e)=> this.props.onDelete(employee.id, e)}>
                Delete
              </button>
            }
            <button className="btn second-btn btn-success" onClick={this.onSave}>Save employee</button>
          </div>
          <Tabs defaultIndex={this.props.tabIdx}>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Jobs</Tab>
              <Tab>Invoices</Tab>
            </TabList>

            <TabPanel>
              <form className="person-form">
                <div className="input-group">
                  <div className="col-2">
                    <div>
                      <div>
                        <label>
                          Name
                        </label>
                        <input type="text" value={employee.name} name="name" onChange={this.onChange} />
                      </div>
                      <div>
                        <label>
                          Email
                        </label>
                        <input type="text" value={employee.email} name="email"  onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Phone
                        </label>
                        <input type="text" value={employee.phone} name="phone" onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Role 
                        </label>
                        <input type="text" value={employee.role} name="role" onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Address
                        </label>
                        <LocationSearchInput 
                          getLocation={this.getLocation} 
                          onLocationChange={this.onLocationChange} 
                          address={this.state.employee.address}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="map">
                        <Map  latLng={this.state.employee.latLng}/>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </TabPanel>
            <TabPanel>
              <div className="tab-header"> 
                <Link to={{
                  pathname: "/schedule/new-job",
                  state: { 
                    redirect: {
                      path: window.location.pathname,
                      employee: this.state.employee,
                      tabIdx: 1
                    },
                  }
                }} >
                  <span>+</span><h2>New Job</h2>
                </Link>
              </div>
              <div className="tab-body">
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Job name</h2></th>
                      <th><h2>Date & time</h2></th>
                      <th><h2>Duratiion</h2></th>
                      <th><h2>Location</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    {jobsList}
                  </tbody>
                </table>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="tab-header invoices"> 
                <Link to="/invoices">
                  <span>+</span><h2>New Invoice</h2>
                </Link>
              </div>
              <div className="tab-body">
                <table className="panel invoices">
                  <thead>
                    <tr className="header">
                      <th><h2>Number</h2></th>
                      <th><h2>employee</h2></th>
                      <th><h2>Title</h2></th>
                      <th><h2>Date</h2></th>
                      <th><h2>Amount due</h2></th>
                      <th><h2>Status</h2></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-employee">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-employee">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-employee">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-employee">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPanel>
          </Tabs>
        </div>

      </div>
    )
  }
}


export const EmployeeDetails = connect(state => ({ jobs: state.jobsByEmployee}), {getJobByEmployee})(EmployeeDetailsComp);