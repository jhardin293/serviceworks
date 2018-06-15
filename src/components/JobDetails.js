import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { MapSearch } from './MapSearch'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import CustomerDropdown from '../components/CustomerDropdown'
import { getCustomers } from '../actions'

class JobDetailsComp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      job: {
        start: moment(props.job.start),
        end: moment(props.job.end),
        employees:  props.job.employees,
        customer: props.job.customer,
        title: props.job.title,
        id: props.job.id || '',
        latLng: props.job.latLng, 
        address: props.job.address || '',
      },
      exit: props.exit,
      allowDelete: props.allowDelete,
    }
  }

  static propTypes = {
    job: PropTypes.object.isRequired,
    customers: PropTypes.object.isRequired,
    getCustomers: PropTypes.func.isRequired,
    exit: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    allowDelete: PropTypes.bool,
  }

  onChange = (e) => {
    this.setState({ job: {...this.state.job,[e.target.name]: e.target.value }});
  }

  componentWillMount() {
    this.props.getCustomers();
  }

  getLocation = (address) => {
    this.setState({job:{...this.state.job, address}})
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({job:{...this.state.job, latLng}})
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    this.setState({job:{...this.state.job, address}})
  }


  handleCustomer = (customer) => {
    if (customer.address && customer.latLng) {
      this.setState({job: {...this.state.job, customer, latLng: customer.latLng, address: customer.address  }});
    }else {
      this.setState({job: {...this.state.job, customer }});
    }
  }

  handleChange = ({ start, end }) => {
    start = start || this.state.job.start
    end = end || this.state.job.end

    if (start.isAfter(end)) {
      end = start
    }
    this.setState({job: {...this.state.job, start, end }});
  }
  handleChangeStart = (start) => this.handleChange({ start })

  handleChangeEnd = (end) => this.handleChange({ end })

  handleSelectChange = (value) => {
    this.setState({job: {...this.state.job, employees: value }});
  }

  handleMarkerClick = () => {
    console.log(arguments, 'clicked')
  }
  render() {
    const { customer, employees, start, end } = this.state.job;
    const allowDelete = this.state.allowDelete;
    const duration =  moment.duration(end.diff(start)).format("d [days]  h [hours]  m [minutes]");
    if (this.props.exit === true) {
      return <Redirect to="/" />
    }
    return (
      <div className="new-job-view page-view">
        <div className="page-header">
          <h1>{this.state.job.title || 'New Job'}</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/">
              <button className="btn second-btn btn-cancel ">Cancel</button>
            </Link>
            {allowDelete &&
              <button 
                className="btn second-btn btn-delete" 
                onClick={(e)=> this.props.onDelete(this.state.job.id, e)}>
                Delete
              </button>
            }
            <button 
              className="btn second-btn btn-success" 
              onClick={(e)=> this.props.onSave(this.state.job, e)}>
              Save
            </button>
          </div>
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
                      </div>
                    </div>
                    <div className="panel">
                      <div className="header">
                        <h2>Employees</h2>
                      </div>
                      <div className="panel-body">
                        <Select
                          name="form-field-name"
                          multi
                          value={employees}
                          onChange={this.handleSelectChange}
                          searchable
                          className="tags"
                          options={[
                            { value: 'Billy Joel', label: 'Billy Joel' },
                            { value: 'Sarah Ann', label: 'Sarah Ann' },
                          ]}
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
    )
  }
}
export const JobDetails = connect(state => ({ customers: state.customers}), {getCustomers})(JobDetailsComp);