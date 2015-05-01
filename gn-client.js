/**
 * Created by me on 4/21/15.
 */


/**
 *  gn-client.ja
 *
 *  Gravity Neutral Client-side support for react.js
 *
 */
// Workaround for ECMA 6
"use strict";

/**
 * Generic Progress component
 **/
class Progress extends React.Component {
    render() { return (
        <div>
        <div className="progressbar-outer">
        <div style={ {width: this.props.percentComplete + '%'}} className="progressbar-inner">
    {this.props.percentComplete}%
</div>
</div>
</div>
);}
}

/**
 * Submit button
 **/
class SubmitButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
        };
    }

    render() { return (
        <div>
        <input type="submit" value={this.props.value} disabled={this.state.disabled} />
        </div>
);}
}



/**
 * Job status values
 */
var JOB_STATUS = {
    IDLE : {value: 0, name: "IDLE"},
    WORKING : {value: 1, name: "WORKING"},
    FINISHED : {value: 2, name: "FINISHED"}
};

/**
 * 'Base' class for Jobs
 */
class ReactJob extends React.Component {

    constructor(props) {
        super(props);
        // ES6 state
        this.state =  {
            status: JOB_STATUS.IDLE,
            jobID: '',
            jobParameters: '',
            percentComplete: 0,
            results: '',
            isServerConnected: false
        };
        //  Class variables
        this.eventSource = '';
        //  Setup bindings
        this.manageEventSource  = this.manageEventSource.bind(this);
        this.serverPercent      = this.serverPercent.bind(this);
        this.serverFinish       = this.serverFinish.bind(this);

    }
    // Called on initial render of the application
    componentWillMount() {
        //       this.manageEventSource(this.state.jobID);
    }
    componentDidUpdate() {
        this.manageEventSource(this.state.jobID);
    }
    // SSE Listener / Job Progress
    serverPercent(event) {
        var data = JSON.parse(event.data);
        console.log('PROGRESS:EVENT::% = ', data);
        this.setState({percentComplete: data * 100, status: JOB_STATUS.WORKING});
    }
    // SSE Listener / Job Results
    serverFinish(event) {
        console.log('RESULTS:EVENT::', event);
        var data = JSON.parse(event.data);
        this.setState({jobId: '', results: data, percentComplete: 100, isServerConnected: false});
        this.eventSource.close();
        this.setState({status: JOB_STATUS.FINISHED});
        // Assumes subclass has SubmitButton component and set ref=submitButton
        this.refs.submitButton.setState({disabled: false})
    }
    manageEventSource(jobID) {
        if (! this.state.isServerConnected && this.state.jobID.length > 0) {
            var url = "http://quantum.dtison.net/sse/?jobID=" + this.state.jobID;
            this.eventSource = new EventSource(url);
            this.setState({isServerConnected: true});
            // SSE Listener setup
            this.eventSource.addEventListener("progress", this.serverPercent);
            this.eventSource.addEventListener("finish", this.serverFinish);
        }
    }
}


