/**
 * Created by me on 4/21/15.
 */
/**
 Job UI Instance implements - constructor(), handleSubmit() and render()
 */
class SlowComputeJob extends ReactJob {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        console.log ('enter handleSubmit ', this);
        e.preventDefault();
        var seconds  = React.findDOMNode(this.refs.seconds).value.trim();

        console.log (seconds);
        if (!seconds) {
            seconds = 5;
        }

        //  Erase any previous results
        this.setState({results: ''});

        // Submit job to server via rest url
        var url = 'http://quantum.dtison.net/job/slow-compute/' + seconds;
        var self = this;
        $.ajax(url).done(function (data) {
            console.log ('Setting jobID...', data);
            self.setState({jobID: data.id});
        });

        // Final visual stuff..
        React.findDOMNode(this.refs.seconds).value = '';
        this.refs.submitButton.setState({disabled: true})
    }
    // Custom Job UI form + results display
    render() { return (
        <div>
            Slow Compute Simulator
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Seconds to run... (enter a number)" ref="seconds" />
                <SubmitButton  value="Start" ref="submitButton"/>
            </form>
            {this.state.percentComplete > 0 ? <Progress percentComplete={this.state.percentComplete} /> : ''}
            {this.state.jobID.length ? <p>Job ID: {this.state.jobID}</p> : ''}
            <p>{this.state.results.number ? 'Number: ' + this.state.results.number : ''}</p>
            <p>{this.state.results.elapsed_time ? 'Elapsed Time: ' + this.state.results.elapsed_time : ''}</p>
        </div>
    );}
}

