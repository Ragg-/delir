import classnames from 'classnames'
import _ from 'lodash'
import React from 'react'
import { Platform } from 'utils/platform'

import s from './DragNumberInput.sass'

interface Props {
  className?: string
  min?: number
  max?: number
  name?: string
  value?: string | number
  disabled?: boolean
  allowFloat?: boolean
  onChange?: (value: number) => any
  doubleClickToEdit?: boolean
}

interface State {
  value: number | string
}

export default class DragNumberInput extends React.Component<Props, State> {
  public get value(): number {
    return +this.state.value
  }

  public static defaultProps = {
    allowFloat: false,
    disabled: false,
    doubleClickToEdit: false,
    value: 0,
  }

  public state = {
    value: this.props.value != null ? this.props.value : 0,
  }

  private input = React.createRef<HTMLInputElement>()
  private pointerLocked: boolean = false
  private noEmitChangeOnBlur: boolean = false

  public componentDidMount() {
    // tslint:disable-next-line:no-console
    this.input.current!.onpointerlockerror = e => console.error(e)
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value! })
    }
  }

  public render() {
    return (
      <input
        ref={this.input}
        type="text"
        className={classnames(s.DragNumberInput, this.props.className)}
        value={this.state.value}
        onBlur={this.handleBlur}
        onChange={this.handleChangeValue}
        onKeyDown={this.handleKeyDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      />
    )
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = this.input.current!

    if (e.key === 'Enter') {
      e.preventDefault()

      const value = this.parseValue(e.currentTarget.value)
      this.setState({ value }, () => {
        input.blur()
      })
    } else if (e.key === 'Escape') {
      e.preventDefault()

      this.noEmitChangeOnBlur = true
      this.setState({ value: this.props.value != null ? this.props.value : 0 }, () => {
        // Wait to value changing completely
        input.blur()
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()

      const value = this.parseValue(e.currentTarget.value) + (e.altKey ? 0.1 : 1)
      this.setState({ value })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()

      const value = this.parseValue(e.currentTarget.value) - (e.altKey ? 0.1 : 1)
      this.setState({ value })
    }
  }

  private handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = this.parseValue(this.input.current!.value)

    if (this.input.current!.value.trim() === '') {
      value = this.props.value != null ? this.parseValue(this.props.value) : 0
      this.noEmitChangeOnBlur = true
    }

    this.setState({ value }, () => {
      this.noEmitChangeOnBlur === false && this.props.onChange && this.props.onChange(value)
      this.noEmitChangeOnBlur = false
    })
  }

  private handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (e.nativeEvent.which !== 1) return // not mouse left pressed

    // requestPointerLock() on input element brokes input cursor behaviour
    // So delay pointerLock until movement occurs
    if (Math.abs(e.nativeEvent.movementX) > 1) {
      e.currentTarget.requestPointerLock()
      this.pointerLocked = true
    } else {
      return
    }

    let weight = 0.3

    if (e.ctrlKey) {
      weight = 0.05
    } else if (e.shiftKey) {
      weight = 2
    }

    const value = this.parseValue(this.input.current!.value) + e.nativeEvent.movementX * weight
    this.setState({ value: this.parseValue(value) })
  }

  private handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = this.input.current!

    if (this.pointerLocked) {
      document.exitPointerLock()
      input.blur()
    }

    this.pointerLocked = false
  }

  // TODO: parse and calculate expression
  private handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    this.setState({ value })
  }

  private parseValue(rawValue: number | string): number {
    const parsedValue = parseFloat(rawValue as string)
    let value = _.isNaN(parsedValue) ? 0 : parsedValue

    if (!this.props.allowFloat) {
      value = Math.round(value)
    } else {
      value = Math.round(value * 100) / 100
    }

    return value
  }
}
