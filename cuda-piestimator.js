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
        this.setState({status: JOB_STATUS.IDLE, results: ''});

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
    render() { return (
        <div>
            CUDA Pi Estimator
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Number Simulations.. (enter a number)" ref="num_sims" />
                <SubmitButton  value="Start" ref="submitButton"/>
            </form>
            {this.state.percentComplete > 0 ? <Progress percentComplete={this.state.percentComplete} /> : ''}
            {this.state.jobID.length ? <p>Job ID: {this.state.jobID}</p> : ''}

            {/*  Display job parameters  */}
            {this.state.jobParameters != '' ? <Parameters parameters={this.state.jobParameters} /> : ''}
            {/*  Render custom results component if job is finished  */}
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
                <li>Name: {this.props.results.hardware_details.name}</li>
                <li>Cores: {this.props.results.hardware_details.cores}</li>
                <li>Clock: {this.props.results.hardware_details.clock}</li>
                <li># Streaming Multiprocessors: {this.props.results.hardware_details.streaming}</li>
            </ul>

        </div>
    );}
}


/*  Custom job parameters  component  */

class Parameters extends React.Component {
    render() { return (
        <div>
            Executing Job with Parameters
            <ul>
                <li># Sims: {this.props.parameters.num_sims}</li>
            </ul>

        </div>
    );}

}


//{this.state.jobParameters.length ? <p>Job ID: {this.state.jobID}</p> : ''}


/*
<p>{(this.state.status === JOB_STATUS.FINISHED) ? 'Elapsed Time: ' + this.state.results.elapsed_time + ' ms' : ''}</p>
<p>{(this.state.status === JOB_STATUS.FINISHED) ? 'Pi was calculated as: ' + this.state.results.pi : ''}</p>
*/

//data: "{"pi":"3.141592655815447","elapsed_time":"21731","…","cores":"192","clock":"0.797","streaming":"1"}}",

