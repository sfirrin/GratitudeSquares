import React from 'react'
import styled, { keyframes } from 'styled-components'
import chroma from 'chroma-js'
import { GratitudeEntryTitleStyle } from './JournalInput'

export const Square = styled.div`
    position: absolute;
    width: ${props => props.side}px;
    height: ${props => props.side}px;
    background-color: ${props => props.backgroundColor};
    transform: translate(
        ${props => props.startingVW}vw,
        ${props => props.startingVH}vh
    );
`

// Animations
const returnToCenter = keyframes`
    from { transform: translate(50vw, 50vh); }
`

const fadeOut = keyframes`
    0% { opacity: 1; }
    75% { opacity: 0.25}
    100% { opacity: 0; }
`

const rotate360 = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`

export const LaunchedSquare = Square.extend`
    animation: ${returnToCenter} 3s ease-out infinite;
    animation-name: ${props => props.returnToStart}, ${fadeOut};
    transform: translate(
        ${props => props.destinationVW + 'vw, ' + props.destinationVH + 'vh'}
    );
    animation-duration: ${props => props.animationDuration}s;
    animation-delay: ${props => props.animationDelay}s;
`

export class SquareComponent extends React.Component {
    render() {
        return <Square side={5} backgroundColor="#DEADA5" />
    }
}

const LauncherLabel = styled.div`
    ${GratitudeEntryTitleStyle};
    transform: translate(-20px, -20px);
    top: ${props => props.vh}vh;
    left: ${props => props.vw}vw;
    position: absolute;
    font-size: 2em;
    font-family: 'Didact Gothic', sans-serif;
    font-weight: 700;
`

export class SquareLauncher extends React.Component {
    /*  Keeps the squares it launches as children
    */
    constructor(props) {
        super(props)
        this.returnToStartAnimation = keyframes`
            from { transform: translate(${props.vw}vw, ${props.vh}vh); }
        `
        this.squares = this.makeManySquares(props.numberOfSquaresToLaunch)
    }
    makeSquare(key = 0) {
        /*  Makes a square that animates to a random point on the page
        */
        const animationDuration =
            1 + Math.random() * this.props.squareAnimationDurationFactor

        return (
            <LaunchedSquare
                side={this.props.squareSideLength}
                backgroundColor={chroma.random()}
                destinationVH={Math.random() * 100}
                destinationVW={Math.random() * 100}
                animationDuration={animationDuration} // (1 + .01*random(100))*5s
                animationDelay={Math.random() * -100 * animationDuration} // -.01*random(100)*$t
                key={key}
                startingVW={this.props.vw}
                startingVH={this.props.vh}
                returnToStart={this.returnToStartAnimation}
            />
        )
    }

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.numberOfSquaresToLaunch !==
                this.props.numberOfSquaresToLaunch ||
            nextProps.label !== this.props.label
        )
    }

    componentWillUpdate(nextProps) {
        this.squares = this.makeManySquares(nextProps.numberOfSquaresToLaunch)
    }

    makeManySquares(squareCount) {
        return [...Array(squareCount).keys()].map(
            // Reusing whatever previous square is at the index
            index => this.squares[index] || this.makeSquare(index)
        )
    }

    render() {
        console.log(this)
        return (
            <div className="square-launcher">
                <LauncherLabel
                    className="launcher-label"
                    vw={this.props.vw}
                    vh={this.props.vh}
                >
                    {this.props.label}
                </LauncherLabel>
                {this.squares}
            </div>
        )
    }
}

SquareLauncher.defaultProps = {
    vw: 10,
    vh: 50,
    numberOfSquaresToLaunch: 60,
    squareSideLength: 6,
    squareAnimationDurationFactor: 10
}
