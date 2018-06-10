import React, { Component } from 'react'
import moment from 'moment'
import { editJob, deleteJob } from '../actions'
import { JobDetails } from '../components/JobDetails'

export class EditJob extends Component {
  job =   this.props.location.state.job
  state = {
    job : {
      start: moment(this.job.start),
      end: moment(this.job.end),
      employees: this.job.employees,
      customer: this.job.customer,
      title:  this.job.title,
      id: this.job.id,
      latLng: this.job.latLng,
      address: this.job.address
    },
    exit: false,
  }
  onSave = (job) => {
    const jobClone = {...job};
    jobClone.start = new Date(jobClone.start);
    jobClone.end = new Date(jobClone.end);
    editJob(jobClone);

    this.setState({exit: true});
  }

  onDelete = (id) => {
    deleteJob(id);
    this.setState({exit: true});
  }

  render() {
    return (
      <JobDetails 
        job={this.state.job} 
        onSave={this.onSave} 
        onDelete={this.onDelete}
        exit={this.state.exit} 
        allowDelete="true"
      />
    )
  }  
}