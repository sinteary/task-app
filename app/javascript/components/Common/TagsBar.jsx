import React from "react";
import { Icon, Label } from 'semantic-ui-react';

//Form for inputting tags. Used to create/edit tasks or searching for tasks by tags.
class TagsBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: "",
		};

		this.onChange = this.onChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			let tag_name = this.state.input;
			if (tag_name.length == 0) {
				return;
			}
			if (!this.props.current_tags.includes(tag_name)) {
				this.props.current_tags.push(tag_name);
				console.log("TAG ADDED: ", tag_name);
			}
			this.setState({
				input: ""
			});
		}
	}

	deleteTag(index) {
		this.props.current_tags.splice(index, 1);
		console.log("TAG DELETED");
		this.forceUpdate();
	}

	render() {
		const allTags = this.props.current_tags.map((tag, index) => (
			<Label color={"teal"} key={index} as='a'>
				{tag}
				<Icon name="delete" onClick={() => this.deleteTag(index)}></Icon>
			</Label >
		));
		return (
			<div className="tags">
				<div className="form-group">
					<label htmlFor="tagsbar">Tags</label>
					<input
						type="text"
						name="input"
						className="form-control"
						required
						value={this.state.input}
						onChange={(data) => {
							this.onChange(data);
						}}
						onKeyPress={this.handleKeyPress}
					/>
				</div >
				<div className="tag-display">
					{this.props.current_tags.length > 0 ? allTags : null}
				</div>
			</div>
		);
	}

}

export default TagsBar;