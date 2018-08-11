import React, { Component } from 'react'
import moment from 'moment'
import { newJob } from '../actions'
import { JobDetails } from '../components/JobDetails'

export class NewJob extends Component {
  state = {
    job : {
      start: moment(),
      end: moment(),
      employees:  [''],
      customer: '',
      title:  '',
      latLng: {
        lat: 37.7749295,
        lng: -122.41941550000001 
      },
    },
    exit: false,
  }
  componentWillMount() {
    if (this.props.location.state) {
      this.setState({redirect: this.props.location.state.redirect})
    }
  }

  onCancel = () => {
    this.setState({exit: true});
  }

  onSave = (job) => {
    const jobClone = {...job};
    jobClone.start = new Date(jobClone.start);
    jobClone.end = new Date(jobClone.end);
    newJob(jobClone);

    this.setState({exit: true});
  }
  
  render() {
    return (
      <JobDetails 
        job={this.state.job} 
        onSave={this.onSave}  
        onCancel={this.onCancel}
        exit={this.state.exit}
        redirect={this.state.redirect}
      />
    )
  }  
}