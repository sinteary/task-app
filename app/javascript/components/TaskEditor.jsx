import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import TagsBar from "./TagsBar";
import DatePicker from 'react-datepicker';
import { Form, Input } from 'semantic-ui-react';
import "react-datepicker/dist/react-datepicker.css";

class TaskEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      date: null,
      time: null,
      tags: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
  }

  //replace < and > characters with escaped value
  //so that we do not store raw HTML in database
  stripHtmlEntities(str) {
    return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  setBlankInput() {
    this.setState({
      name: "",
      description: ""
    })
  }

  onChange(event) {
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  parseDate(date, time) {
    let combinedDate;
    if (date == null) {
      return null;
    } else {
      if (time == null) {
        return date;
      } else {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
          time.getHours(), time.getMinutes(), time.getSeconds());
      }
    }
  }


  //handles submission
  onSubmit() {
    const url = "/api/v1/tasks/create";
    if (this.state.name.length == 0)
      return;

    let combinedDate = this.parseDate(this.state.date, this.state.time);

    //console.log(combinedDate);

    Axios.post(url, {
      name: this.state.name,
      description: this.state.description,
      done: false,
      duedate: combinedDate
    })
      .then((response) => {
        console.log(response);
        this.props.refresh();
        this.setBlankInput();
      })
      .catch(error => console.log(error.message));
  }

  handleTags(taskid) {
    let numTags = this.state.tags.length;
    if (numTags > 0) {
      for (i = 0; i < numTags; i++) {

      }
    }
  }

  onEdit() {
    console.log(this.props.taskid);
    const url = `/api/v1/tasks/${this.props.taskid}`
    Axios.put(url, {
      name: this.state.name,
      description: this.state.description
    })
      .then(response => {
        console.log(response.data);
        this.props.refresh();
        this.setBlankInput();
      })
      .catch(error => console.log(error));
  }

  componentDidUpdate(prevProps) {
    if (this.props.taskid !== prevProps.taskid) {
      console.log(this.props.taskid);
      if (this.props.editing == false) {
        this.setBlankInput()
      } else {
        const url = `/api/v1/show/${this.props.taskid}`
        Axios.get(url)
          .then(response => {
            console.log(response.data)
            this.setState({
              name: response.data.name,
              description: response.data.description
            })
          })
      }
    }
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="task-editor" style={{ flex: 0.8, margin: '0 auto' }}>
            <h2 className="font-weight-normal mb-5">
              {this.props.editing ? "Editing task:" : "Add new task:"}
            </h2>
            <Form>
              <Form.Field>
                <label htmlFor="taskName">Task name</label>
                <input
                  type="text"
                  name="name"
                  id="taskName"
                  className="form-control"
                  required
                  value={this.state.name}
                  onChange={(data) => {
                    this.onChange(data);
                  }}
                  style={{ background: "rgba(255,255,255,0.5)" }}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="taskDescription">Description </label>
                <textarea
                  type="text"
                  name="description"
                  rows="3"
                  id="taskDescription"
                  className="form-control"
                  onChange={this.onChange}
                  value={this.state.description}
                  style={{ background: "rgba(255,255,255,0.5)" }}
                />
                {/* <small id="descriptionHelp" className="form-text text-muted">
                  
                </small> */}
              </Form.Field>
              <Form.Group widths="equal">
                <Form.Field>
                  <label htmlFor="datepicker"> Due date </label>
                  <DatePicker
                    id="datepicker"
                    selected={this.state.date}
                    onChange={date => {
                      this.setState({ date: date });
                      console.log(date);
                    }}
                    customInput={
                      <Input
                        style={{ width: "120px", float: "left" }}
                        value={this.state.date}
                      />
                    }
                  />
                  <label htmlFor="timepicker"> Time </label>
                  <DatePicker
                    id="timepicker"
                    selected={this.state.time}
                    showTimeSelect
                    showTimeSelectOnly
                    disabled={this.state.date == null ? true : false}
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholder="Disabled"
                    onChange={date => {
                      this.setState({ time: date });
                      console.log(date);
                    }}
                    customInput={
                      <Input
                        // disabled={this.state.date == null ? "disabled" : null}
                        style={{ width: "100px", float: "left" }}
                        value={this.state.date} />
                    }
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <TagsBar
                  current_tags={this.state.tags}
                  editing={this.props.editing}
                ></TagsBar>
              </Form.Field>
              <button type="button" onClick={this.props.editing ? this.onEdit : this.onSubmit} className="btn custom-button">
                {this.props.editing ? "Save" : "Create"}
              </button>
              {this.props.editing ?
                <button type="button" onClick={this.props.disableEdit} className="btn custom-button">
                  Cancel
                </button>
                : null}
            </Form>
          </div>
        </div>
      </div>
    );
  }

}

export default TaskEditor;