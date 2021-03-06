import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import DatePicker from 'react-datepicker'
import { MapSearch } from './MapSearch'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import CustomerDropdown from '../components/CustomerDropdown'
import EmployeeMultiSelect from './EmployeeMultiSelect'
import { PageNavs } from '../components/PageNavs'

import phone from '../images/phone.svg'
import mail from '../images/mail.svg'


const addEmployees = (props) => {
  if (props.redirect.employee) {
    const employeeFromRedirct = {
      address: props.redirect.employee.address,
      id: props.redirect.employee.id,
      label: props.redirect.employee.name,
      latLng: props.redirect.employee.latLng,
      value: props.redirect.employee.name,
    }

    function removeDuplicates(myArr, prop) {
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
    const employees = removeDuplicates(
      [...props.job.employees, employeeFromRedirct].filter(Boolean),
      'id'
    );

    return employees;
  } else {
    return props.job.employees
  }
}

const addCustomer = (props) => {
  if (props.redirect.customer) {
    return {
      address: props.redirect.customer.address,
      id: props.redirect.customer.id,
      phone:props.redirect.customer.phone,
      email:props.redirect.customer.email,
      label: props.redirect.customer.name,
      latLng: props.redirect.customer.latLng,
    }

  } else {
    return props.job.customer;
  }
}

const addlatLng = (props) => {
  if (props.redirect.customer) {
    return props.redirect.customer.latLng;
  } else {
    return props.job.latLng;
  }
}

const addAddress = (props) => {
  if (props.redirect.customer) {
    return props.redirect.customer.address;
  } else {
    return props.job.address || '';
  }
}

export class JobDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: {
        start: moment(props.job.start),
        end: moment(props.job.end),
        employees: addEmployees(props),
        customer: addCustomer(props),
        title: props.job.title,
        id: props.job.id || '',
        latLng: addlatLng(props),
        address: addAddress(props),
      },
      exit: props.exit,
      allowDelete: props.allowDelete,
      redirect: props.redirect,
      openModal: props.openModal
    }
  }

  static propTypes = {
    job: PropTypes.object.isRequired,
    redirect: PropTypes.object.isRequired,
    exit: PropTypes.bool.isRequired,
    leavePage: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
    allowDelete: PropTypes.bool,
  }

  componentDidUpdate(prevProps) {
    if (this.props.openModal !== prevProps.openModal) {
      this.setState({ openModal: this.props.openModal });
    }
  }

  onChange = (e) => {
    this.setState({ job: { ...this.state.job, [e.target.name]: e.target.value } });
  }

  getLocation = (address) => {
    this.setState({ job: { ...this.state.job, address } })
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({ job: { ...this.state.job, latLng } })
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    this.setState({ job: { ...this.state.job, address } })
  }


  handleCustomer = (customer) => {
    if (customer.address && customer.latLng) {
      this.setState({ job: { ...this.state.job, customer, latLng: customer.latLng, address: customer.address } });
    } else {
      this.setState({ job: { ...this.state.job, customer } });
    }
  }

  handleEmployee = (value) => {
    this.setState({ job: { ...this.state.job, employees: value } });
  }

  handleChange = ({ start, end }) => {
    start = start || this.state.job.start
    end = end || this.state.job.end

    if (start.isAfter(end)) {
      end = start
    }
    this.setState({ job: { ...this.state.job, start, end } });
  }
  handleChangeStart = (start) => this.handleChange({ start })

  handleChangeEnd = (end) => this.handleChange({ end })


  handleMarkerClick = () => {
    console.log(arguments, 'clicked')
  }


  render() {
    const { customer, employees, start, end } = this.state.job;
    const allowDelete = this.state.allowDelete;
    const duration = moment.duration(end.diff(start)).format("d [days]  h [hours]  m [minutes]");
    if (this.props.exit === true) {
      if (this.props.redirect.employee) {
        return <Redirect
          to={{
            pathname: this.props.redirect.path,
            state: {
              employee: this.props.redirect.employee,
              tabIdx: this.props.redirect.tabIdx
            }
          }}
        />
      }
      if (this.props.redirect.customer) {
        return <Redirect
          to={{
            pathname: this.props.redirect.path,
            state: {
              customer: this.props.redirect.customer,
              tabIdx: this.props.redirect.tabIdx
            }
          }}
        />
      } else {
        return <Redirect
          to={{
            pathname: '/schedule',
          }}
        />
      }
    }
    return (
      <div className="page-view">
        <div className="new-job-view ">
          <div className="page-header">
            <h1>{this.state.job.title || 'New Job'}</h1>
          </div>
          <div className="page-body">
            <PageNavs
              subject={'job'}
              leavePage={this.props.leavePage}
              openModal={this.state.openModal}
              handleCloseModal={this.props.handleCloseModal}
              onSave={this.props.onSave}
              onCancel={this.props.onCancel}
              onDelete={this.props.onDelete}
              payload={this.state.job}
              allowDelete={allowDelete}
              openExitModal={this.props.openExitModal}
              openDeleteModal={this.props.openDeleteModal}
              handleDeleteConfirmation={this.props.handleDeleteConfirmation}
            />
            <Tabs>
              <TabList>
                <Tab>Details</Tab>
              </TabList>

              <TabPanel>
                <form className="person-form">
                  <div className="input-group">
                    <input
                      type="text"
                      name="title"
                      placeholder="Job title"
                      onChange={this.onChange}
                      value={this.state.job.title}
                    />
                  </div>
                  <div className="input-group date-picker-group">
                    <div className="pickers">
                      <div>
                        <label>Starts</label>
                        <DatePicker
                          selected={this.state.job.start}
                          selectsStart
                          start={this.state.job.start}
                          end={this.state.job.end}
                          onChange={this.handleChangeStart}
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Time"
                          showTimeSelect
                          dateFormat="LLL"
                          calendarClassName="time-range-picker"
                        />
                      </div>
                      <div>
                        <label>Ends</label>
                        <DatePicker
                          selected={this.state.job.end}
                          selectsEnd
                          start={this.state.job.start}
                          end={this.state.job.end}
                          onChange={this.handleChangeEnd}
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Time"
                          showTimeSelect
                          dateFormat="LLL"
                          calendarClassName="time-range-picker"
                        />
                      </div>
                    </div>
                    <div className="time-range">
                      <span className="bordered-group"></span>
                      {duration}
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="col-2">
                      <div className="panel">
                        <div className="header">
                          <h2>Customer</h2>
                        </div>
                        <div className="panel-body">
                          <CustomerDropdown
                            onChange={this.handleCustomer}
                            value={customer}
                          />
                          <div className="customer-contact">
                            <div className="item">
                              <img src={phone} alt="phone"/>
                              <p>{customer.phone}</p>
                            </div> 
                            <div className="item">
                              <img src={mail} alt="mail"/>
                              <p>{customer.email}</p>
                            </div> 
                          </div>
                        </div>
                      </div>
                      <div className="panel">
                        <div className="header">
                          <h2>Employees</h2>
                        </div>
                        <div className="panel-body">
                          <EmployeeMultiSelect
                            onChange={this.handleEmployee}
                            value={employees}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                    </div>
                  </div>
                  <div className="map">
                    <MapSearch
                      getLocation={this.getLocation}
                      address={this.state.job.address}
                      latLng={this.state.job.latLng}
                      onLocationChange={this.onLocationChange}
                    />
                  </div>
                </form>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}