import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Link, Redirect } from 'react-router-dom'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { LocationSearchInput } from '../components/LocationSearchInput'
import { connect } from 'react-redux'
import { getJobByCustomer, getInvoicesByCustomer } from '../actions'
import Map from '../components/Map'



export class CustomerDetailsComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {
        name: props.customer.name,
        company: props.customer.company,
        email: props.customer.email,
        phone: props.customer.phone,
        address: props.customer.address,
        latLng: props.customer.latLng,
        id: props.customer.id || ''
      }
    }
  }

  static propTypes = {
    customer: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    exit: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired
  }

  onChange = (e) => {
    this.setState({ customer: { ...this.state.customer, [e.target.name]: e.target.value } });
  }

  componentWillMount() {
    this.props.getJobByCustomer(this.state.customer);
    this.props.getInvoicesByCustomer(this.state.customer);
  }


  getLocation = (address) => {
    this.setState({ customer: { ...this.state.customer, address } })
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({ customer: { ...this.state.customer, latLng } })
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    this.setState({ customer: { ...this.state.customer, address } })
  }

  onSave = () => {
    this.props.onSave(this.state.customer);
  }
  headerDisplay = () => {
    const customer = this.state.customer,
      company = customer.company,
      name = customer.name;
    if (name && company) {
      return name + " : " + company;
    } else if (company) {
      return company;
    } else {
      return name;
    }
  }
  render() {
    const customer = this.state.customer,
      allowDelete = this.props.allowDelete,
      jobs = this.props.jobs.jobsByCustomer,
      invoices = this.props.invoices.invoicesByCustomer;


    const invoicesList = invoices.map((invoice, i) => {
      if (invoice.dueDate.toDate) {
        invoice.dueDate = invoice.dueDate.toDate();
      }
      const dueDate = moment(invoice.dueDate).format('l');

      return (
        <tr key={i}>
          <td>
            <Link to={{
              pathname: "/invoices/edit-invoice",
              state: {
                redirect: {
                  path: window.location.pathname,
                  customer: this.state.customer,
                  tabIdx: 2
                },
                invoice
              }
            }} >{invoice.invoiceNumber}
            </Link>
          </td>
          <td>{invoice.customer.label}</td>
          <td>{invoice.title}</td>
          <td>{dueDate}</td>
          <td>${invoice.total}</td>
          <td>Current</td>
        </tr>
      )

    });

    const jobsList = jobs.map((job, i) => {
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
                  customer: this.state.customer,
                  tabIdx: 1
                },
                job
              }
            }} >{job.title}
            </Link>
          </td>
          <td>{start.format('l')} {moment(start).format('LT')} to {moment(end).format('l')} {moment(end).format('LT')} </td>
          <td><b>{duration}</b></td>
          <td>{job.address}</td>
        </tr>
      )
    })



    if (this.props.exit === true) {
      return <Redirect to="/customers" />
    }
    return (
      <div className="new-customer-view person-view page-view">
        <div className="page-header">
          <h1>{this.headerDisplay() || 'New Customer'}</h1>
        </div>
        <div className="page-body">
          <Tabs defaultIndex={this.props.tabIdx}>
            {!this.props.newCustomer &&
              <TabList>
                <Tab>Details</Tab>
                <Tab>Jobs</Tab>
                <Tab>Invoices</Tab>
              </TabList>
            }
            {this.props.newCustomer &&
              <TabList>
                <Tab>Details</Tab>
              </TabList>
            }

            <TabPanel>
              <div>
              <div className="action-header">
                  <div></div>
                  <div className="tab-btn-group">
                    <Link to="/customers">
                      <button className="btn second-btn btn-cancel ">Cancel</button>
                    </Link>
                    {allowDelete &&
                      <button
                        className="btn second-btn btn-delete"
                        onClick={(e) => this.props.onDelete(customer.id, e)}>
                        Delete
                      </button>
                    }
                    <Link to="/customers">
                      <button className="btn second-btn btn-success" onClick={this.onSave}>Save customer</button>
                    </Link>
                  </div>
                </div>
                <form className="person-form">
                  <div className="input-group">
                    <div className="col-2">
                      <div>
                        <div>
                          <label>
                            Name
                          </label>
                          <input type="text" value={customer.name} name="name" onChange={this.onChange} />
                        </div>
                        <div>
                          <label>
                            Company
                          </label>
                          <input type="text" value={customer.company} name="company" onChange={this.onChange} />
                        </div>
                        <div>
                          <label>
                            Email
                          </label>
                          <input type="text" value={customer.email} name="email" onChange={this.onChange} />
                        </div>
                        <div>
                          <label>
                            Phone
                          </label>
                          <input type="text" value={customer.phone} name="phone" onChange={this.onChange} />
                        </div>
                        <div>
                          <label>
                            Address
                          </label>
                          <LocationSearchInput
                            getLocation={this.getLocation}
                            onLocationChange={this.onLocationChange}
                            address={this.state.customer.address}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="map">
                          <Map latLng={this.state.customer.latLng} />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

              </div>

            </TabPanel>
            <TabPanel>
              <div className="tab-header">
                <Link to={{
                  pathname: "/schedule/new-job",
                  state: {
                    redirect: {
                      path: window.location.pathname,
                      customer: this.state.customer,
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
                <Link to={{
                  pathname: "/invoices/new-invoice",
                  state: {
                    redirect: {
                      path: window.location.pathname,
                      customer: this.state.customer,
                      tabIdx: 2
                    },
                  }
                }} >
                  <span>+</span><h2>New Invoice</h2>
                </Link>
              </div>
              <div className="tab-body">
                <table className="panel invoices">
                  <thead>
                    <tr className="header">
                      <th><h2>Number</h2></th>
                      <th><h2>Customer</h2></th>
                      <th><h2>Title</h2></th>
                      <th><h2>Date</h2></th>
                      <th><h2>Amount due</h2></th>
                      <th><h2>Status</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    {invoicesList}
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

export const CustomerDetails = connect(state => ({ jobs: state.jobsByCustomer, invoices: state.invoicesByCustomer }), { getJobByCustomer, getInvoicesByCustomer })(CustomerDetailsComp);