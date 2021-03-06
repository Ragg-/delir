import { EncodingOption } from '@ragg/deream'
import { Button } from 'components/Button/Button'
import { Checkbox } from 'components/Checkbox/Checkbox'
import { FormSection } from 'components/FormSection/FormSection'
import { Input } from 'components/Input/Input'
import { ModalContent } from 'components/ModalContent/ModalContent'
import { SelectBox } from 'components/SelectBox/SelectBox'
import path from 'path'
import React, { ChangeEvent, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useEscKeyListener, useObjectState, useValidation } from 'utils/hooks'
import t from './RenderingSettingModal.i18n'

export interface RenderingOption {
  destination: string
  encodingOption: EncodingOption
}

interface Props {
  onClose: (result: RenderingOption | false) => void
}

interface State {
  videoCodec: string
  videoBitrate: string
  audioCodec: string
  audioBitrate: string
  destPath: string
  useAlpha: boolean
}

const VCODEC_TO_EXT: Record<string, string> = {
  libx264: 'mp4',
  libx265: 'mp4',
  utvideo: 'avi',
  'libvpx-vp9': 'webm',
}

const AVAILABLE_ACODEC_FOR_VCODEC: Record<string, { label: string; value: string }[]> = {
  libx264: [{ label: 'AAC Low profile', value: 'aac_low' }],
  libx265: [{ label: 'AAC Low profile', value: 'aac_low' }],
  utvideo: [{ label: 'PCM', value: 'pcm' }],
  'libvpx-vp9': [{ label: 'Opus', value: 'libopus' }],
}

const Row = styled.div`
  display: flex;
  margin-left: -16px;
`

const Column = styled.div`
  margin-left: 16px;
`

export const RenderingSettingModal = ({ onClose }: Props) => {
  const [{ videoCodec, videoBitrate, audioCodec, audioBitrate, destPath, useAlpha }, setState] = useObjectState<State>({
    videoCodec: 'libx264',
    videoBitrate: '1024k',
    audioCodec: 'aac_low',
    audioBitrate: '256k',
    destPath: '',
    useAlpha: false,
  })

  const { errors, isValid } = useValidation(
    errors => {
      errors.destPath = destPath == '' ? t(t.k.errors.destRequired) : null
    },
    [videoCodec, audioCodec, destPath],
  )

  useEffect(() => {
    if (destPath === '') return
    const { dir, name } = path.parse(destPath)
    setState({ destPath: path.format({ dir, name, ext: `.${VCODEC_TO_EXT[videoCodec]}` }) })
  }, [videoCodec])

  useEscKeyListener(() => onClose(false), [onClose])

  const handleClickSelectFile = useCallback(async () => {
    // prettier-ignore
    const filters: Electron.FileFilter[] =
      videoCodec === 'libx264' || videoCodec === 'libx265' ? [{ extensions: ['mp4'], name: 'mp4' }]
      : videoCodec === 'utvideo' ? [{ extensions: ['avi'], name: 'avi' }]
      : videoCodec === 'libvpx-vp9' ? [{extensions: ['webm'], name: 'WebM' }]
      // : videoCodec === 'qt' ? [{ extensions: ['mov'], name: 'QuickTime movie' }]
      : []

    const result = await globalThis.require('electron').remote.dialog.showSaveDialog({ filters })
    if (result.canceled || !result.filePath) return

    setState({ destPath: result.filePath })
  }, [videoCodec])

  const handleChangePreset = useCallback(value => {
    if (value === 'mp4') {
      setState({ videoCodec: 'libx264', audioCodec: 'aac_low', useAlpha: false })
    } else if (value === 'utvideoAlpha') {
      setState({ videoCodec: 'utvideo', audioCodec: 'pcm', useAlpha: true, videoBitrate: '', audioBitrate: '' })
    } else if (value === 'webm') {
      setState({
        videoCodec: 'libvpx-vp9',
        audioCodec: 'libopus',
        useAlpha: false,
        videoBitrate: '1024k',
        audioBitrate: '256k',
      })
    }
  }, [])

  const handleChangeVideoCodec = useCallback((value: string) => {
    setState({
      videoCodec: value as any,
      ...(value === 'utvideo' ? { videoBitrate: '' } : {}),
      audioCodec:
        AVAILABLE_ACODEC_FOR_VCODEC[value].filter(({ value }) => value === audioCodec)?.[0]?.value ??
        AVAILABLE_ACODEC_FOR_VCODEC[value][0].value,
    })
  }, [])

  const handleChangeVideoBitrate = useCallback((value: string) => {
    setState({ videoBitrate: value })
  }, [])

  const handleChangeUseAlpha = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setState({ useAlpha: e.currentTarget.checked })
  }, [])

  const handleChangeAudioCodec = useCallback((value: string) => {
    setState({ audioCodec: value as any, ...(value === 'pcm' ? { audioBitrate: '' } : {}) })
  }, [])

  const handleChangeAudioBitrate = useCallback((value: string) => {
    setState({ audioBitrate: value })
  }, [])

  const handleClickCancel = useCallback(() => {
    onClose(false)
  }, [])

  const handleClickStart = useCallback(() => {
    if (!isValid()) return

    onClose({
      destination: destPath,
      encodingOption: {
        vCodec: videoCodec as any,
        vBitrate: videoBitrate === '' ? null : videoBitrate,
        aCodec: audioCodec as any,
        aBitrate: audioBitrate === '' ? null : audioBitrate,
        useAlpha,
      },
    })
  }, [videoCodec, audioCodec, useAlpha, destPath])

  return (
    <ModalContent
      footer={
        <>
          <Button kind="normal" onClick={handleClickCancel}>
            {t(t.k.cancel)}
          </Button>
          <Button kind="primary" onClick={handleClickStart}>
            {t(t.k.startRendering)}
          </Button>
        </>
      }
    >
      <h1>{t(t.k.title)}</h1>

      <FormSection label={t(t.k.encodingPreset)}>
        <SelectBox onChange={handleChangePreset} value="">
          <option value="mp4">MP4 (H.264 + AAC)</option>
          {/* <option value="qt">Qt Animation (Alpha channel)</option> */}
          <option value="utvideoAlpha">Ut Video (Alpha channel)</option>
          <option value="webm">WebM</option>
        </SelectBox>
      </FormSection>

      <FormSection label={t(t.k.saveTo)} error={errors.destPath}>
        <Input blocked readOnly onClick={handleClickSelectFile} placeholder="Click to select a file" value={destPath} />
      </FormSection>

      <h2>{t(t.k.advancedOptions)}</h2>

      <Row>
        <Column>
          <FormSection label={t(t.k.videoCodec)}>
            <SelectBox value={videoCodec} onChange={handleChangeVideoCodec}>
              <option value="libx264">H.264</option>
              <option value="libx265">H.265</option>
              {/* <option value="qt">Qt Animation (Alpha channel)</option> */}
              <option value="libvpx-vp9">WebM</option>
              <option value="utvideo">Ut video codec</option>
            </SelectBox>
          </FormSection>
        </Column>
        <Column>
          <FormSection label={t(t.k.bitrate)}>
            <SelectBox value={videoBitrate} onChange={handleChangeVideoBitrate}>
              <option value="" selected={videoBitrate === ''} />
              <option value="1024k">1024k</option>
              <option value="2048k">2048k</option>
            </SelectBox>
          </FormSection>
        </Column>
      </Row>

      <div style={{ marginTop: '16px' }}>
        <FormSection
          label={
            <label>
              <span style={{ marginRight: '8px' }}> {t(t.k.useAlpha)}</span>{' '}
              <Checkbox checked={useAlpha} onChange={handleChangeUseAlpha} />
            </label>
          }
        />
      </div>

      <Row style={{ marginTop: '16px' }}>
        <Column>
          <FormSection label={t(t.k.audioCodec)}>
            <SelectBox value={audioCodec} onChange={handleChangeAudioCodec}>
              {AVAILABLE_ACODEC_FOR_VCODEC[videoCodec].map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectBox>
          </FormSection>
        </Column>
        <Column>
          <FormSection label={t(t.k.bitrate)}>
            <SelectBox value={audioBitrate} onChange={handleChangeAudioBitrate}>
              <option value="" selected={audioBitrate === ''} />
              <option value="128k">128k</option>
              <option value="256k">256k</option>
              <option value="320k">320k</option>
            </SelectBox>
          </FormSection>
        </Column>
      </Row>
    </ModalContent>
  )
}
