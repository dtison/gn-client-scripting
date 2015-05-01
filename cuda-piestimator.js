/**
 Job UI Instance implements - constructor(), handleSubmit() and render()
 */
class CUDAPiEstimatorJob extends ReactJob {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({status: JOB_STATUS.WAITING, percentComplete: 0, results: ''});

        var num_sims = React.findDOMNode(this.refs.num_sims).value.trim();
        if (! num_sims) {
            num_sims = 100000;
        }
        // Submit job to server via rest url
        var url = 'http://quantum.dtison.net/job/cuda-piestimator/' + num_sims;
        $.ajax(url).done(function (data) {

            this.setState({jobID: data.id, jobParameters: {num_sims: num_sims}});
            // Final visual stuff..
            React.findDOMNode(this.refs.num_sims).value = '';
            this.refs.submitButton.setState({disabled: true})
        }.bind(this));
    }

    // Custom Job UI form + results display
    render() {
        var status = this.getStatusValue();
        return (
        <div>
            CUDA Pi Estimator
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Number Simulations.. (enter a number)" ref="num_sims" />
                <SubmitButton  value="Start" ref="submitButton"/>
            </form>
            {/*  Progress bar, current Job ID and job status */}
            {this.state.percentComplete > 0 ? <Progress percentComplete={this.state.percentComplete} /> : ''}
            {this.state.jobID.length ? <p>Job ID: {this.state.jobID}  <em>{status}</em></p> : ''}

            {/*  Job parameters user entered  */}
            {this.state.jobParameters != '' ? <Parameters parameters={this.state.jobParameters} /> : ''}
            {/*  Custom results component when job is finished  */}
            {(this.state.status === JOB_STATUS.FINISHED) ? <Results results={this.state.results} /> : ''}

        </div>
    );}
}

/*  Custom results  component  */

class Results extends React.Component {
    render() { return (
        <div>
           <p>Pi: {this.props.results.pi}</p>
            <p>Elapsed time: {this.props.results.elapsed_time} ms</p>
            Execution Hardware Info
            <ul>
                <li>GPU: {this.props.results.hardware_details.name}</li>
                <li>Cores: {this.props.results.hardware_details.cores}</li>
                <li>Clock: {this.props.results.hardware_details.clock}</li>
                <li>Streaming Multiprocessors: {this.props.results.hardware_details.streaming}</li>
            </ul>

        </div>
    );}
}


/*  Custom job parameters  component  */

class Parameters extends React.Component {
    render() { return (
        <div>
            Job Parameters
            <ul>
                <li>Number sims: {this.props.parameters.num_sims}</li>
            </ul>
        </div>
    );}

}

/*
    TODO's:
    1.  If job waits for hardware to become available - display WAITING message
    2.  Some kind of default timeout range in case we never get server push?  is an error condition.
    3.  Synchronize all these reactjobs - nthroot and slowcompute to latest piest. version
    4.  Safer UI for demo - dropdown select numbers instead of entering (too big #s)
    5.  Think about a job Cancel button how would work - worker gets msg from gearman?
    6.  For some reason server pushes for progress were getting confused with multiple jobs active.
     - supposed to only send by job id.
7.  why is 720 faster than 750?


 */