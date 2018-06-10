import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Link, Redirect } from 'react-router-dom'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { LocationSearchInput } from '../components/LocationSearchInput'
import Map from '../components/Map'


import noteImg1 from '../images/note-img-1.jpg'
import threeDots from '../images/three-dots.png'

export class CustomerDetails extends Component {
  constructor (props) {
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

  onChange = (e) => {
    this.setState({ customer: {...this.state.customer,[e.target.name]: e.target.value }});
  }

  getLocation = (address) => {
    this.setState({customer:{...this.state.customer, address}})
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({customer:{...this.state.customer, latLng}})
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    this.setState({customer:{...this.state.customer, address}})
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
    }else if (company) {
      return company;
    }else {
      return name;
    }
  }
  render() {
    const customer = this.state.customer,
      allowDelete = this.props.allowDelete;

    if (this.props.exit === true) {
      return <Redirect to="/customers" />
    }
    return (
      <div className="new-customer-view person-view page-view">
        <div className="page-header">
          <h1>{this.headerDisplay() || 'New Customer'}</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/customers">
              <button className="btn second-btn btn-cancel ">Cancel</button>
            </Link>
            {allowDelete &&
              <button 
                className="btn second-btn btn-delete" 
                onClick={(e)=> this.props.onDelete(customer.id, e)}>
                Delete
              </button>
            }
            <Link to="/customers">
              <button className="btn second-btn btn-success" onClick={this.onSave}>Save customer</button>
            </Link>
          </div>
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Jobs</Tab>
              <Tab>Notes</Tab>
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
                        <input type="text" value={customer.name} name="name" onChange={this.onChange} />
                      </div>
                      <div>
                        <label>
                          Company
                        </label>
                        <input type="text" value={customer.company} name="company" onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Email
                        </label>
                        <input type="text" value={customer.email} name="email"  onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Phone
                        </label>
                        <input type="text" value={customer.phone} name="phone" onChange={this.onChange}/>
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
                        <Map  latLng={this.state.customer.latLng}/>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </TabPanel>
            <TabPanel>
              <div className="tab-header"> 
                <Link to="/schedule/new-job">
                  <span>+</span><h2>New Job</h2>
                </Link>
              </div>
              <div className="tab-body">
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Job name</h2></th>
                      <th><h2>Date</h2></th>
                      <th><h2>Time</h2></th>
                      <th><h2>Location</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    <tr>
                      <td><Link to="/schedule/new-job">Window cleaning</Link></td>
                      <td>April 21, 2018</td>
                      <td>1:00am - 2:00 am</td>
                      <td>42 W 89th St, New York</td>
                    </tr>
                    <tr>
                      <td><Link to="/schedule/new-job">Window cleaning</Link></td>
                      <td>April 21, 2018</td>
                      <td>1:00am - 2:00 am</td>
                      <td>42 W 89th St, New York</td>
                    </tr>
                    <tr>
                      <td><Link to="/schedule/new-job">Window cleaning</Link></td>
                      <td>April 21, 2018</td>
                      <td>1:00am - 2:00 am</td>
                      <td>42 W 89th St, New York</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="tab-header notes"> 
                <Link to="/notes/new-note">
                  <span>+</span><h2>New Note</h2>
                </Link>
              </div>
              <div className="page-body">
                <div className="notes-list panel">
                  <div className="header">
                    <h2>Note text</h2>
                    <h2>Created</h2>
                  </div>
                  <div className="panel-body">
                    <div className="sort-group">
                      <div className="month-group"><span>March 2018</span></div>
                      <div className="group-body">
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sort-group">
                      <div className="month-group"><span>March 2018</span></div>
                      <div className="group-body">
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      <th><h2>Customer</h2></th>
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
                      <td><Link to="customers/new-customer">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-customer">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-customer">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-customer">Sally May</Link></td>
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