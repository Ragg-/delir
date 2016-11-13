// @flow

import React, {PropTypes} from 'react'
import classnames from 'classnames'

export default class DragNumberInput extends React.Component
{
    static propTypes = {
        className: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        name: PropTypes.string,
        defaultValue: PropTypes.number,
        disabled: PropTypes.bool,
        allowFloat: PropTypes.bool,
        onChange: PropTypes.func,
        doubleClickToEdit: PropTypes.bool,
    }

    static defaultProps = {
        allowFloat: false,
        disabled: false,
        doubleClickToEdit: false,
    }

    state: Object

    constructor(...args)
    {
        super(...args)

        this.state = {
            readOnly: false,
            value: this.props.defaultValue,
            dummyImage: document.createElement('img'),
        }

        this.state.dummyImage.src = 'images/empty.png'
    }

    componentDidMount()
    {
        this.refs.input.onpointerlockerror = e => console.error(e)
    }

    enableAndFocus()
    {
        this.setState({readOnly: false})
        this.refs.input.focus()
        this.refs.input.select()
    }

    onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (this.state.readOnly) {
                this.enableAndFocus()
            } else {
                this.props.onChange && this.props.onChange(this.refs.input.value)
                this.setState({value: this.refs.input.value})
            }
        } else if (e.key === 'Escape') {
            this.refs.input.value = this.props.defaultValue
            this.props.onChange && this.props.onChange(this.refs.input.value)
            this.setState({readOnly: true, value: this.props.defaultValue})
        }
    }

    onBlur = (e: FocusEvent) =>
    {
        if (this.state.readOnly) return

        this.props.onChange && this.props.onChange(this.refs.input.value)
        this.setState({readOnly: true})
    }

    onMouseDown = (e: MouseEvent) =>
    {
        e.target.requestPointerLock()
        // e.dataTransfer.effectAllowed = 'none'
        // e.dataTransfer.setDragImage(this.state.dummyImage, 0, 0)
    }

    onMouseMove = ({nativeEvent: e}: MouseEvent) =>
    {
        if (e.which !== 1) return // not mouse left pressed

        let weight = 0.3
        let value

        if (e.ctrlKey) {
            weight = 0.05
        } else if (e.shiftKey) {
            weight = 2
        }

        value = this.state.value + e.movementX * weight

        if (! this.props.allowFloat) {
            value = value|0
        }

        this.setState({value})
    }

    onMouseUp = (e: MouseEvent) =>
    {
        document.exitPointerLock()
    }

    valueChanged = (e: Event) =>
    {
        this.setState({value: this.refs.input.value})
    }

    render()
    {
        return (
            <span
                ref='input'
                type='text'
                tabIndex='-1'
                className={classnames('_drag-number-input', this.props.className)}
                placeholder={this.props.placeholder}
                readOnly={this.state.readOnly}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onChange={this.valueChanged}
                onKeyDown={this.onKeyDown}
            >
                {this.state.value}
            </span>
        )
    }
}
