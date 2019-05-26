import * as Delir from '@delirvfx/core'
import { ContextProp, withFleurContext } from '@fleur/fleur-react'
import * as classnames from 'classnames'
import * as _ from 'lodash'
import * as React from 'react'
import { DraggableEventHandler } from 'react-draggable'
import { Rnd, RndResizeCallback } from 'react-rnd'
import { SpreadType } from '../../utils/Spread'

import { ContextMenu, MenuItem, MenuItemOption } from '../../components/ContextMenu/ContextMenu'
import * as EditorOps from '../../domain/Editor/operations'
import * as ProjectOps from '../../domain/Project/operations'

import { GlobalEvent, GlobalEvents } from '../AppView/GlobalEvents'
import t from './Clip.i18n'
import * as s from './Clip.styl'

interface OwnProps {
    clip: SpreadType<Delir.Entity.Clip>
    left: number
    width: number
    active: boolean
    postEffectPlugins: Delir.PluginSupport.Types.PluginSummary[]
    hasError: boolean
    onChangePlace: (clipId: string, newPlacedPx: number) => any
    onChangeDuration: (clipId: string, newDurationPx: number) => any
}

interface ConnectedProps {
    postEffectPlugins: Delir.PluginSupport.Types.PluginSummary[]
}

interface State {
    left: number
}

type Props = OwnProps & ConnectedProps & ContextProp

export default withFleurContext(
    class Clip extends React.Component<Props, State> {
        public state: State = {
            left: this.props.left,
        }

        public shouldComponentUpdate(nextProps: Props, nextState: State) {
            const { props, state } = this
            return !_.isEqual(props, nextProps) || !_.isEqual(state, nextState)
        }

        public componentDidUpdate(prevProps: Props) {
            if (prevProps.left !== this.props.left) {
                this.setState({ left: this.props.left })
            }
        }

        public render() {
            const { clip, active, postEffectPlugins, width, hasError } = this.props
            const { left } = this.state

            return (
                <Rnd
                    className={classnames(s.clip, {
                        [s.active]: active,
                        [s.video]: clip.renderer === 'video',
                        [s.audio]: clip.renderer === 'audio',
                        [s.text]: clip.renderer === 'text',
                        [s.image]: clip.renderer === 'image',
                        [s.adjustment]: clip.renderer === 'adjustment',
                        [s.p5js]: clip.renderer === 'p5js',
                        [s.hasError]: hasError,
                    })}
                    dragAxis="x"
                    position={{ x: left, y: 2 }}
                    size={{ width: width, height: 'auto' }}
                    enableResizing={{
                        left: true,
                        right: true,
                        top: false,
                        bottom: false,
                    }}
                    onDragStart={this.handleDragStart}
                    onDragStop={this.handleDragEnd}
                    onResize={this.handleResize}
                    onResizeStop={this.handleResizeEnd}
                    onMouseDown={this.handleClick}
                    tabIndex={-1}
                >
                    <div>
                        <ContextMenu>
                            <MenuItem
                                label={t(t.k.contextMenu.seekToHeadOfClip)}
                                onClick={this.handleSeekToHeadOfClip}
                            />
                            <MenuItem label={t(t.k.contextMenu.effect)}>
                                {postEffectPlugins.length ? (
                                    postEffectPlugins.map(entry => (
                                        <MenuItem
                                            key={entry.id}
                                            label={entry.name}
                                            data-clip-id={clip.id}
                                            data-effect-id={entry.id}
                                            onClick={this.handleAddEffect}
                                        />
                                    ))
                                ) : (
                                    <MenuItem label={t(t.k.contextMenu.pluginUnavailable)} enabled={false} />
                                )}
                            </MenuItem>
                            {/* <MenuItem label='Make alias ' onClick={this.makeAlias.bind(null, clip.id)} /> */}
                            <MenuItem type="separator" />
                            <MenuItem
                                label={t(t.k.contextMenu.remove)}
                                data-clip-id={clip.id}
                                onClick={this.handleRemoveClip}
                            />
                            <MenuItem type="separator" />
                        </ContextMenu>
                        <span className={s.nameLabel}>{t(['renderers', clip.renderer])}</span>
                        <span className={s.idLabel}>#{clip.id.substring(0, 4)}</span>
                    </div>
                </Rnd>
            )
        }

        private handleClick = () => {
            GlobalEvents.on(GlobalEvent.copyViaApplicationMenu, this.handleGlobalCopy)
            GlobalEvents.on(GlobalEvent.cutViaApplicationMenu, this.handleGlobalCut)
            this.props.executeOperation(EditorOps.changeActiveClip, {
                clipId: this.props.clip.id!,
            })
        }

        private handleDragStart: DraggableEventHandler = e => {
            this.props.executeOperation(EditorOps.setDragEntity, {
                entity: { type: 'clip', clip: this.props.clip },
            })
        }

        private handleDragEnd: DraggableEventHandler = (e, drag) => {
            this.props.onChangePlace(this.props.clip.id, drag.x)
        }

        private handleResize: RndResizeCallback = (e, dir, ref, delta, pos) => {
            this.setState({ left: pos.x })
        }

        private handleResizeEnd: RndResizeCallback = (e, direction, ref, delta, pos) => {
            const { clip } = this.props

            if (pos.x !== this.props.left) {
                this.props.onChangePlace(clip.id, pos.x)
            }

            this.props.onChangeDuration(clip.id, this.props.width + delta.width)
        }

        private handleAddEffect = ({ dataset }: MenuItemOption<{ clipId: string; effectId: string }>) => {
            this.props.executeOperation(ProjectOps.addEffectIntoClip, {
                clipId: dataset.clipId,
                processorId: dataset.effectId,
            })
            this.props.executeOperation(EditorOps.seekPreviewFrame)
        }

        private handleRemoveClip = ({ dataset }: MenuItemOption<{ clipId: string }>) => {
            this.props.executeOperation(ProjectOps.removeClip, {
                clipId: dataset.clipId,
            })
        }

        private handleSeekToHeadOfClip = () => {
            const { clip } = this.props
            this.props.executeOperation(EditorOps.seekPreviewFrame, {
                frame: clip.placedFrame,
            })
        }

        private handleGlobalCopy = () => {
            this.props.executeOperation(EditorOps.copyEntity, {
                type: 'clip',
                entity: this.props.clip,
            })
        }

        private handleGlobalCut = () => {
            this.props.executeOperation(EditorOps.copyEntity, {
                type: 'clip',
                entity: this.props.clip,
            })
            this.props.executeOperation(ProjectOps.removeClip, {
                clipId: this.props.clip.id,
            })
        }
    },
)
