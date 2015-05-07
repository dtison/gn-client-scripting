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
        // Get Job Status string
        var status = this.getStatusValue();
        return (
        <div>
            CUDA Pi Estimator
            <form onSubmit={this.handleSubmit}>
                <select name="Number Simulations" defaultValue=""  ref="num_sims">
                    <option value=""> - Choose # Simulations -</option>
                    <option value="10000">10000 (Fast)</option>
                    <option value="100000">100000 (More accurate)</option>
                    <option value="1000000">1000000 </option>
                    <option value="110000000">10000000 </option>
                    <option value="1000000000">1000000000 (Slowest most accurate)</option>
                </select>
                <SubmitButton  value="Start" ref="submitButton"/>
            </form>
            {/*  Progress bar, current Job ID and job status */}
            {this.state.percentComplete > 0 ? <Progress percentComplete={this.state.percentComplete} /> : ''}
            {this.state.jobID.length ? <p>Job ID: {this.state.jobID}  <em>{status}</em></p> : ''}
            {this.state.errorMessage.length ? <p>Error Message: {this.state.errorMessage}</p>  : ''}

            {/*  Job parameters user entered  */}
            {this.state.jobParameters != '' ? <Parameters parameters={this.state.jobParameters} /> : ''}
            {/*  Custom results component when job is finished  */}
            {(this.state.status === JOB_STATUS.FINISHED) ? <Results results={this.state.results} /> : ''}
        </div>
    );}
}

/*<input type="text" placeholder="Number Simulations.. (enter a number)" ref="num_sims" />*/






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
