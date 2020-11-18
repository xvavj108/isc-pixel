import { Loader } from '@/components'
import { useRest } from '@/context/RestContext'
import { setCanvasState } from '@/store/modules/canvas'
import { useAppDispatch, useAppStore, useDocumentEvent } from '@/utils/hooks'
import { CanvasInfo } from '@shared/rest'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Controls } from './components/Controls/Controls'
import { PaintCanvas } from './components/PaintCanvas'
import { SessionModal } from './components/SessionModal'
import { Welcome } from './components/Welcome'

type Props = {}

export const Main = ({}: Props) => {
	const rest = useRest()

	const dispatch = useAppDispatch()
	const session = useAppStore(state => state.session.id)

	const [info, setInfo] = useState(undefined as CanvasInfo | undefined)
	const [zoom, setZoom] = useState(3)
	const [sessionModal, setSessionModal] = useState(false)

	const handleSessionRequest = () => {
		setSessionModal(true)
	}

	useEffect(() => {
		rest.getCanvasInfo().then(info => {
			dispatch(
				setCanvasState({
					width: info.width,
					height: info.height,
					palette: info.palette.map(c => c.toLowerCase())
				})
			)

			setInfo(info)
		})
	}, [])

	useDocumentEvent('wheel', (e: WheelEvent) => {
		if (e.deltaY > 0) {
			setZoom(zoom => Math.max(0.1, zoom * 0.85))
		} else {
			setZoom(zoom => Math.min(20, zoom * 1.25))
		}
	})

	return (
		<MainContainer>
			{info ? (
				<>
					<Welcome />
					<Controls onSessionRequested={handleSessionRequest} />
					<PaintCanvas
						info={info}
						zoom={zoom}
						onSessionRequested={handleSessionRequest}
					/>
					{!session && sessionModal && (
						<SessionModal onClose={() => setSessionModal(false)} />
					)}
				</>
			) : (
				<Loader loaded={false} />
			)}
		</MainContainer>
	)
}

const MainContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
`
