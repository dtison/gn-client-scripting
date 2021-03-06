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
    IDLE : {value: 0, name: "Idle."},
    WAITING : {value: 1, name: "Queued for Processing..."},
    WORKING : {value: 2, name: "In Progress.."},
    FINISHED : {value: 3, name: "Finished."},
    ERROR : {value: 4, name: "Error."}
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
            port: '',
            jobParameters: '',
            percentComplete: 0,
            results: '',
            errorMessage: '',
            isServerConnected: false
        };
        //  Class variables
        this.eventSource = '';
        //  Setup bindings
        this.manageEventSource  = this.manageEventSource.bind(this);
        this.serverProgress     = this.serverProgress.bind(this);
        this.serverFinish       = this.serverFinish.bind(this);
        this.serverError        = this.serverError.bind(this);
        this.serverJobReceived  = this.serverJobReceived.bind(this);

    }
    // Called on initial render of the application
    componentWillMount() {
        //       this.manageEventSource(this.state.jobID);
    }
    componentDidUpdate() {
        this.manageEventSource(this.state.jobID);
    }
    //  Closes down SSE connection, and resets some job parameters (for next run)
    closeJob() {
        console.log('Calling this.eventSource.close()');
        this.eventSource.close();
        this.setState({jobID: '',  isServerConnected: false});
        // Re-activate UI, assumes subclass has SubmitButton component and set ref=submitButton
        this.refs.submitButton.setState({disabled: false});
    }
    // SSE Listener / Job Error (termination)
    serverError(event) {
        console.log('ERROR:EVENT::', event);
        var data = JSON.parse(event.data);
        this.closeJob();
        this.setState({status: JOB_STATUS.ERROR, percentComplete: 0, errorMessage: data});
    }
    // SSE Listener / Job Received
    serverJobReceived(event) {
        var data = JSON.parse(event.data);
        console.log('JOBRECEIVED:EVENT::% = ', data);
        this.setState({percentComplete: 0.000000001, status: JOB_STATUS.WAITING});
    }
    // SSE Listener / Job Progress
    serverProgress(event) {
        var data = JSON.parse(event.data);
        console.log('PROGRESS:EVENT::% = ', data);
        this.setState({percentComplete: data * 100, status: JOB_STATUS.WORKING});
    }
    // SSE Listener / Job Results
    serverFinish(event) {
        console.log('FINISH:EVENT::', event);
        var data = JSON.parse(event.data);
        this.closeJob();
        this.setState({status: JOB_STATUS.FINISHED, percentComplete: 100, results: data});
    }
    manageEventSource(jobID) {
        if (! this.state.isServerConnected && this.state.jobID.length > 0) {
            console.log('manageEventSource - JobID is now ', this.state.jobID);
//  TODO:  Is  - jobID still needed here?  For anything else?
            var url = "http://quantum.dtison.net/sse/?jobID=" + this.state.jobID + "&port=" + this.state.port;
            this.eventSource = new EventSource(url);
            this.setState({isServerConnected: true});
            // SSE Listener setup
            this.eventSource.addEventListener("received", this.serverJobReceived);
            this.eventSource.addEventListener("progress", this.serverProgress);
            this.eventSource.addEventListener("finish", this.serverFinish);
            this.eventSource.addEventListener("error", this.serverError);
            // 1 more ?  canceled
        }
    }
    getStatusValue() {
        var statusValue;
        if (this.state.status === JOB_STATUS.IDLE) {
            statusValue = JOB_STATUS.IDLE.name;
        } else if (this.state.status === JOB_STATUS.WAITING) {
            statusValue = JOB_STATUS.WAITING.name;
        } else if (this.state.status === JOB_STATUS.WORKING) {
            statusValue = JOB_STATUS.WORKING.name;
        } else if (this.state.status === JOB_STATUS.FINISHED) {
            statusValue = JOB_STATUS.FINISHED.name;
        }
        return statusValue;
    }
    // If we get here - must have been a timeout or error sending progress
    timeoutJob() {
        if (this.state.status === JOB_STATUS.WAITING) {
            this.setState({status: JOB_STATUS.ERROR});
        }

    }

  /*  showProgress() {
        this.state.percentComplete > 0 ? <Progress percentComplete={this.state.percentComplete} /> : ''
    }*/

}


