import React from 'react'
import styled from 'styled-components'
import { getRandomColor } from './JournalInput'

const SUCCESS_ITEM_MINIMUM = 3

const MenuOverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 25%;
    background-color: #eeeeee;
    opacity: ${props => (props.active ? 1 : 0)};
    transition: opacity ease-in-out 0.3s;
    z-index: 5;

    div.overlay-menu {
        top: ${props => (props.active ? '10px' : '-910px')};
    }
`

const Menu = styled.div`
    margin: 0 auto;
    width: 900px;
    max-width: 80vw;
    height: 900px;
    max-height: 90vh;
    background-color: ${getRandomColor(0.6).css()};
    opacity: 1;
    position: relative;
    transition: top ease-out 0.3s;
    font-family: 'Didact Gothic', sans-serif;
`

const InnerMenu = styled.div`
    position: absolute;
    width: 100%;
`

const SuccessMessage = styled.h2`
    // bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 2em;
    opacity: 1;
`

const GratitudeItems = styled.div`
    width: 100%;
    padding-top: 10px;
    overflow-y: auto;
    max-height: 80vh;
    clear: both;
`

const GratitudeItem = styled.div`
    background-color: rgba(255, 255, 255, 0.8);
    margin: 10px 10px;
    font-size: 2em;
`

export class MenuOverlay extends React.Component {
    constructor(props) {
        super(props)
        this.itemComponents = this.itemComponents.bind(this)
        this.state = { menuActive: false }
        this.setMenuActive = this.setMenuActive.bind(this)
        this.setMenuInactive = this.setMenuInactive.bind(this)
    }

    itemComponents() {
        // Takes the gratitude items prop passed in and renders it into rectangles
        let itemDivs = []
        for (let [index, item] of Object.entries(this.props.items)) {
            if (!item.title) continue
            itemDivs.push(
                <GratitudeItem key={index}>
                    I'm grateful for {item.title} because {item.why}
                </GratitudeItem>
            )
        }

        return itemDivs
    }

    setMenuActive() {
        this.setState({ menuActive: true })
    }

    setMenuInactive() {
        this.setState({ menuActive: false })
    }

    componentWillReceiveProps(newProps) {
        // When user reaches 3, expand this out for them automatically
        if (newProps.thresholdReached && !this.props.thresholdReached) {
            this.setState({ menuActive: true })
        }
    }

    render() {
        return (
            <MenuOverlayContainer
                onMouseEnter={this.setMenuActive}
                onMouseLeave={this.setMenuInactive}
                active={this.state.menuActive}
            >
                <Menu className="overlay-menu">
                    <InnerMenu>
                        <div>
                            {Object.entries(this.props.items).length >
                            SUCCESS_ITEM_MINIMUM ? (
                                <SuccessMessage>
                                    Congrats, you've completed three gratitude
                                    entries for the day. Read more about
                                    gratitude journals at{' '}
                                    <a
                                        href="https://en.wikipedia.org/wiki/Gratitude_journal"
                                        target="_blank"
                                    >
                                        https://en.wikipedia.org/wiki/Gratitude_journal
                                    </a>
                                </SuccessMessage>
                            ) : (
                                <SuccessMessage>
                                    Try to think of a few things you're grateful
                                    for
                                </SuccessMessage>
                            )}
                        </div>
                        <GratitudeItems>{this.itemComponents()}</GratitudeItems>
                    </InnerMenu>
                </Menu>
            </MenuOverlayContainer>
        )
    }
}
