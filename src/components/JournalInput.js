import React from 'react'

import styled, { css, keyframes } from 'styled-components'
import chroma from 'chroma-js'

const INPUT_BACKGROUND_ALPHA = 0.4

const inputSlide = keyframes`
    from {bottom: 100%;}
    to {bottom: 0;}
`

const JournalInputDiv = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 2em;
    font-family: 'Didact Gothic', sans-serif;
    text-align: left;
    animation: ${inputSlide} 1s ease-in-out 1;
    margin: 5px;
`

export const GratitudeEntryTitleStyle = css`
    font-family: 'Didact Gothic', sans-serif;
    font-weight: 700;
`

const secondaryInputGray = 180

export function getRandomColor(opacity = 1.0) {
    return chroma
        .random()
        .saturate(2)
        .luminance(0.3)
        .alpha(opacity)
    // .rgba()
}
const secondaryInputColor = getRandomColor()

const Input = styled.input`
    border: none;
    background-color: ${props => props.backgroundColor || secondaryInputColor};
    transition: background-color 0.5s ease;
    outline: none;
    font-size: 1em;
    text-align: center;
    ${GratitudeEntryTitleStyle};
`

const WhyInput = Input.extend`
    flex-grow: 300;
`

const Form = styled.form``

const FormTemplateText = styled.div`
    font-weight: 700;
    font-family: 'Didact Gothic', sans-serif;
    margin: 5px;
    color: ${props => props.color || secondaryInputColor};
    transition: color 0.5s ease;
    flex-grow: 1;
    text-align: center;
`

export const TitleInput = Input.extend`
    width: 300px;
    flex-grow: 200;
`

const HiddenSubmit = styled.input`
    visibility: hidden;
    display: none;
`

const InputContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
`

const FirstRowContainer = InputContainer.extend`
    flex-grow: 2;
`

const SecondRowContainer = InputContainer.extend`
    flex-grow: 3;
`

// The rows that label-

export class JournalInput extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleItemEdit = this.handleItemEdit.bind(this)
        this.state = {
            title: '',
            why: '',
            color: getRandomColor()
        }
    }

    handleSubmit(event) {
        /*  Clears the state, calls the prop handleSubmit fn
        */
        event.preventDefault()
        this.setState({
            title: '',
            why: '',
            color: getRandomColor()
        })
        this.titleInputElement.focus()
        this.props.handleSubmit(this.inputContainer.clientHeight)
    }

    handleItemEdit(property, newValue) {
        /*  For performance reasons i only update the state in the parent
            When the number of squares for the item's launcher changes
            So i need to keep track of the current values in state here
        */
        this.setState({ [property]: newValue })
        this.props.handleItemEdit(property, newValue)
    }

    render() {
        return (
            <JournalInputDiv
                innerRef={element => {
                    this.inputContainer = element
                }}
            >
                <form onSubmit={this.handleSubmit}>
                    <InputContainer>
                        <FirstRowContainer>
                            <FormTemplateText color={this.state.color}>
                                I'm grateful for{' '}
                            </FormTemplateText>
                            <TitleInput
                                type="text"
                                placeholder=""
                                value={this.state.title}
                                onChange={event =>
                                    this.handleItemEdit(
                                        'title',
                                        event.target.value
                                    )
                                }
                                autoFocus={true}
                                innerRef={element => {
                                    this.titleInputElement = element
                                }}
                                backgroundColor={this.state.color
                                    .alpha(INPUT_BACKGROUND_ALPHA)
                                    .css()}
                            />
                        </FirstRowContainer>
                        <SecondRowContainer>
                            <FormTemplateText color={this.state.color}>
                                {' '}
                                because
                            </FormTemplateText>
                            <WhyInput
                                type="text"
                                placeholder=""
                                value={this.state.why}
                                onChange={event =>
                                    this.handleItemEdit(
                                        'why',
                                        event.target.value
                                    )
                                }
                                backgroundColor={this.state.color
                                    .alpha(INPUT_BACKGROUND_ALPHA)
                                    .css()}
                            />
                            <HiddenSubmit type="submit" />
                        </SecondRowContainer>
                    </InputContainer>
                </form>
            </JournalInputDiv>
        )
    }
}
