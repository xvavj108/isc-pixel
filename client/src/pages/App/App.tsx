import { ApiState } from '@/store/modules/api'
import { colors } from '@/styles'
import { GlobalStyle } from '@/styles/global'
import { useAppStore } from '@/utils/hooks'
import React from 'react'
import styled from 'styled-components'
import { Main } from '../Main/Main'
import { ApiErrorMessage } from './components/ApiErrorMessage'

export const App = () => {
	const apiState = useAppStore(state => state.api.state)

	return (
		<AppContainer id="stars">
			<GlobalStyle />

			{apiState === ApiState.Connected && <Main />}

			<ApiErrorMessage />
		</AppContainer>
	)
}

const AppContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: #000;
	color: ${colors.text};
`