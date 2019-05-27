import React from 'react'

class SpeakBox extends React.Component {
    state = { shouldRender: false}

    componentDidMount() {
        const { delay, audio } = this.props;
        this.timer = setTimeout(() => {
            audio.play()
            this.setState({
                shouldRender: true
            })
        }, delay) 
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        const { text } = this.props;
        const { shouldRender } = this.state

        return (
            <>
                {shouldRender &&
                   <div className="mt-2 text-left">
                    <div className="message border rounded p-2 align-self-start">
                        <p className="mb-0 px-1 text-left">{text}<br/></p>
                    </div>
                    </div> 
                }
            </>
        )
    }
}

export default SpeakBox