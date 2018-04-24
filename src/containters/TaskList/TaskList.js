import React, {Component} from 'react';
import {Button, Form, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
import Rodal from 'rodal';
import {Accordion, AccordionItem} from 'react-sanfona';

import './TaskList.css';
import fire from "../../firebase/firebase";

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todos: {},
            visible: false,
            name: "",
            description: "",
            user: "",
            key: ""
        };
    }

    componentWillMount() {
        this.firebaseRef = fire.database().ref('todos');
        this.firebaseRef.on('value', function (dataSnapshot) {
            let todos = [];
            dataSnapshot.forEach(function (childSnapshot) {
                let todo = childSnapshot.val();
                todo['key'] = childSnapshot.key;
                todos.push(todo);
            });
            this.setState({
                todos: todos
            });
        }.bind(this));
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    removeTodo = (key) => {
        console.log(key);
        let firebaseRef = fire.database().ref('todos');
        firebaseRef.child(key).remove();
    }

    show = () => {
        this.setState({visible: true});
    };

    hide = () => {
        this.setState({visible: false});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.firebaseRef.push({
            description: this.state.description,
            task_name: this.state.name,
            isFinished: false,
            user: this.state.user,
            key: this.state.key
        });

        this.clearInput();
        this.setState({visible: false});
    };

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    };

    handleDescriptionChange = (e) => {
        this.setState({description: e.target.value});
    };

    handleUserChange = (e) => {
        this.setState({user: e.target.value});
    };

    clearInput = () => {
        this.setState({user: "", description: "", name: ""});
    }

    markAsDone = (event) => {
        const newTasks = this.state.todos
        Object.values(newTasks).map(task => {
                if (task.description === task.description) {
                    const newTask = Object.assign(task, {isFinished: true});
                    return newTask;
                }
                return task;
            }
        );
        this.setState(newTasks);

    };

    render() {
        return (
            <div id="container">
                <div id="task_list_wrapper">
                    <Accordion allowMultiple>
                        {Object.values(this.state.todos).map(todo => {
                            return (
                                <AccordionItem
                                    key={todo.key}
                                    title={`${todo.task_name}`}
                                >
                                    <div className="accordion_item_wrapper">
                                        <div className="mark_as_done_wrapper">
                                            <input type='checkbox' className='check-label' id='check'
                                                   onClick={this.markAsDone}/>
                                            <label htmlFor='check'
                                                   className='label-for-check'> Mark as done </label>
                                        </div>
                                        <div className="description_wrapper">
                                            {`Description: ${todo.description}`}
                                        </div>
                                        <div>
                                            {`Is finished: ${todo.isFinished}`}
                                        </div>
                                        <div className="vertical_line">

                                        </div>
                                        <div className="user_wrapper">
                                            {`User: ${todo.user}`}
                                        </div>
                                        <div onClick={() => this.removeTodo(todo.key)}>
                                            X
                                        </div>

                                    </div>
                                </AccordionItem>


                            );
                        })}
                    </Accordion>

                    <Rodal visible={this.state.visible}
                           onClose={this.hide.bind(this)}
                           animation="door"
                           height={350}
                           width={500}>
                        <div>
                            <Form>
                                <FormGroup>
                                    <ControlLabel>Task name</ControlLabel>{' '}
                                    <FormControl type="text" placeholder="Enter task title"
                                                 value={this.state.name}
                                                 onChange={this.handleNameChange}
                                    />
                                </FormGroup>{' '}
                                <FormGroup>
                                    <ControlLabel>Task description</ControlLabel>{' '}
                                    <FormControl type="text" placeholder="Enter task description"
                                                 value={this.state.description}
                                                 onChange={this.handleDescriptionChange}/>
                                </FormGroup>{' '}
                                <FormGroup>
                                    <ControlLabel>User</ControlLabel>{' '}
                                    <FormControl type="text" placeholder="Add task to user"
                                                 value={this.state.user}
                                                 onChange={this.handleUserChange}/>
                                </FormGroup>{' '}
                                <Button type="submit" onClick={this.handleSubmit}>Add task</Button>
                            </Form>
                        </div>
                    </Rodal>
                    <Button id="add_task_btn" bsStyle="primary" onClick={this.show}>Add task</Button>
                </div>
            </div>
        )
    }
}

export default TaskList;
