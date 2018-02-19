import React from 'react'
import { SquareComponent, SquareLauncher } from './GameObjects'
import { JournalInput } from './JournalInput'
import { MenuOverlay } from './MenuOverlay'

function makeEmptyJournalEntry(maxVh = 70) {
    return {
        title: '',
        why: '',
        vh: Math.random() * maxVh + 5, // Don't want to put launchers in the bottom or right
        vw: Math.random() * 80 + 5,
        numberOfSquaresToLaunch: 0
    }
}

export class GameStage extends React.Component {
    constructor(props) {
        super(props)
        /* Items are like {
            title: 'Mom', why: 'Always there for me', vh: <int>, vw: <int>, numberOfSquaresToLaunch: 3
        }
        */
        this.state = {
            items: {
                // Make the first launcher at the top in case mobile keyboard is opened
                0: makeEmptyJournalEntry(25)
            },
            indexCurrentlyEditing: 0,
            inputHeight: 230,
            thresholdReached: false
        }
        this.handleItemEdit = this.handleItemEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleItemEdit(property, newValue) {
        /*  Edits the item at indexCurrentlyEditing,
            changing `property` to newValue
        */
        const previousItems = this.state.items
        const itemToEdit = previousItems[this.state.indexCurrentlyEditing]
        const editedItem = { ...itemToEdit, [property]: newValue }
        const newItems = {
            ...previousItems,
            [this.state.indexCurrentlyEditing]: editedItem
        }
        this.setState({ items: newItems })
    }

    getSquareLauncher(vw, vh, numberOfSquaresToLaunch) {
        return (
            <SquareLauncher
                vw={vw || Math.random() * 100}
                vh={vh || Math.random() * 100}
                numberOfSquaresToLaunch={numberOfSquaresToLaunch || undefined}
            />
        )
    }

    getManySquareLaunchers(launcherCount) {
        let launchers = []
        for (let i = 0; i < launcherCount; i++) {
            launchers.push(this.getSquareLauncher())
        }
        return launchers
    }

    scoreItem(item) {
        /*  Depending on how much a person has written about what they're grateful
            show more or fewer squares
            Returns the numberOfSquaresToLaunch
        */
        let itemScore = 0
        // Baseline of 10 for having anything
        itemScore += item.title.length + item.why.length > 0 ? 10 : 0
        // 2 for each char in title up to 5 chars
        itemScore += Math.min(10, 2 * item.title.length)
        // 0.25 for each char in why
        itemScore += item.why.length * 0.25
        return Math.floor(itemScore)
    }

    getItemLaunchers() {
        /* Returns a list of Square Launchers for each item in 'items'
        */
        return [...Object.values(this.state.items)].map((item, index) => {
            return (
                <SquareLauncher
                    key={index}
                    vw={item.vw}
                    vh={item.vh}
                    numberOfSquaresToLaunch={this.scoreItem(item)}
                    label={item.title}
                />
            )
        })
    }

    handleSubmit(inputDivHeight) {
        /*  Creates a new item and adds it to state
            Changes indexCurrentlyEditing to the previous length of items
            Takes this opportunity to have the input Component report its height in px
        */
        const newIndex = Object.keys(this.state.items).length
        const inputProportionOfWindow = inputDivHeight / window.innerHeight
        const newItems = {
            ...this.state.items,
            [newIndex]: makeEmptyJournalEntry(
                (1 - inputProportionOfWindow) * 90
            )
        }
        this.setState({
            items: newItems,
            indexCurrentlyEditing: newIndex,
            thresholdReached: newIndex >= 3
        })
    }

    render() {
        return (
            <div className="game-stage" style={{ overflow: 'hidden' }}>
                <MenuOverlay
                    items={this.state.items}
                    thresholdReached={this.state.thresholdReached}
                />
                {this.getItemLaunchers()}
                <div
                    className="input-container"
                    ref={element => {
                        this.journalInputElement = element
                    }}
                >
                    <JournalInput
                        title={
                            this.state.items[this.state.indexCurrentlyEditing]
                                .title
                        }
                        handleTitleChange={this.handleTitleChange}
                        why={
                            this.state.items[this.state.indexCurrentlyEditing]
                                .why
                        }
                        handleWhyChange={this.handleWhyChange}
                        handleItemEdit={this.handleItemEdit}
                        handleSubmit={this.handleSubmit}
                    />
                </div>
            </div>
        )
    }
}
