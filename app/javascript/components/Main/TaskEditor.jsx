import React from "react";
import Axios from "axios";
import TagsBar from "../Common/TagsBar";
import DatePicker from 'react-datepicker';
import { Form, Input, Container, Button, Icon } from 'semantic-ui-react';
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
      description: "",
      date: null,
      time: null,
      tags: []
    })
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  parseDate(date, time) {
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
    console.log("ADD TASK TO:" + this.props.tasklistid);
    const url = "/api/v1/tasks/create";
    if (this.state.name.length == 0)
      return;
    let combinedDate = this.parseDate(this.state.date, this.state.time);
    console.log(this.state.tags)
    Axios.post(url, {
      name: this.state.name,
      description: this.state.description,
      done: false,
      duedate: combinedDate,
      tags: this.state.tags,
      tasklist_id: this.props.tasklistid,
      user_id: this.props.user_id
    })
      .then((response) => {
        console.log(response);
        this.props.toggleRefresh();
        this.setBlankInput();
      })
      .catch(error => console.log(error.message));
  }

  onEdit() {
    console.log("NOW EDITING: TASK NUMBER", this.props.taskid);
    const url = `/api/v1/tasks/${this.props.taskid}`

    let combinedDate = this.parseDate(this.state.date, this.state.time);
    Axios.put(url, {
      name: this.state.name,
      description: this.state.description,
      duedate: combinedDate,
      tags: this.state.tags,
      user_id: this.props.user_id
    })
      .then(response => {
        console.log("EDIT RESPONSE DATA:", response.data);
        this.props.toggleRefresh();
        this.setBlankInput();
        this.props.disableEdit();
      })
      .catch(error => console.log("EDIT ERROR:", error));
  }

  deleteTask = (id) => {
    console.log("delete triggered")
    const url = `/api/v1/tasks/${id}`;

    Axios.delete(url)
      .then(response => {
        console.log("DELETE TASK " + id, response)
        this.props.disableEdit();
        this.props.toggleRefresh();
      })
      .catch(error => console.log(error.message));
  }

  componentDidUpdate(prevProps) {
    if (this.props.taskid !== prevProps.taskid) {
      console.log("NOW EDITING:", this.props.taskid);
      if (this.props.editing == false || this.props.adding == true) {
        this.setBlankInput();
      } else {
        const url = `/api/v1/show/${this.props.taskid}`
        Axios.get(url)
          .then(response => {
            console.log("PULL TASK INFO:", response.data);
            let data = response.data;
            this.setState({
              name: data.name,
              description: data.description,
              date: data.duedate == null ? null : new Date(data.duedate),
              time: data.duedate == null ? null : new Date(data.duedate),
              tags: data.tags.map(item => item.name)
            })
          })
      }
    }
  }


  render() {
    return (
      <div className="taskeditor">
        <div>
          <h2 style={{ float: "left" }}>{this.props.editing ? "Editing task" : "Add new task"}</h2>
          {/* <Button style={{ float: "right" }} icon="close" onClick={this.props.disableEdit}></Button> */}
        </div>
        <Form onSubmit={e => { e.preventDefault(); }}>
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
              style={{ background: "rgba(255,255,255)" }}
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
              style={{ background: "rgba(255,255,255)" }}
            />
            {/* <small id="descriptionHelp" className="form-text text-muted">
                  
                </small> */}
          </Form.Field>
          <Form.Group>
            <Form.Field>
              <label htmlFor="datepicker"> Due date </label>
              <DatePicker
                id="datepicker"
                selected={this.state.date}
                onChange={date => {
                  this.setState({ date: date });
                  console.log("SET DATE:", date);
                }}
                customInput={
                  <Input
                    style={{ width: "120px", float: "left" }}
                    value={this.state.date}
                  />
                }
              />
            </Form.Field>

            <Form.Field>
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
                  console.log("SET TIME:", date);
                }}
                customInput={
                  <Input
                    style={{ width: "100px", float: "left" }}
                    value={this.state.date} />
                }
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <TagsBar
              current_tags={this.state.tags}
            ></TagsBar>
          </Form.Field>
          <div style={{ float: "left" }}>
            <Button onClick={this.props.editing ? this.onEdit : this.onSubmit}>
              {this.props.editing ? "Save" : "Create"}
            </Button>
            <Button onClick={this.props.disableEdit}>
              Cancel
          </Button>
          </div>
          {this.props.editing ?
            <div>

              <Button
                floated="right"
                icon="alternate trash"
                color="red"
                onClick={() => this.deleteTask(this.props.taskid)} />
            </div>
            : null}
        </Form>
      </div>
    );
  }

}

export default TaskEditor;