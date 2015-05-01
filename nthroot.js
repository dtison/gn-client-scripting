/**
 Job UI Instance implements - constructor(), handleSubmit() and render()
 */
class NthRootJob extends ReactJob {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        console.log ('enter handleSubmit ', this);
        e.preventDefault();
        var start  = React.findDOMNode(this.refs.start).value.trim();

        console.log (start);
        if (!start) {
            start = 1;
        }

        //  Erase any previous results
        this.setState({results: ''});

        // Submit job to server via rest url
        var url = 'http://quantum.dtison.net/job/nthroot/' + start;
        var self = this;
        $.ajax(url).done(function (data) {
            console.log ('Setting jobID...', data);
            self.setState({jobID: data.id});
        });

        // Final visual stuff..
        React.findDOMNode(this.refs.start).value = '';
        this.refs.submitButton.setState({disabled: true})
    }
    // Custom Job UI form + results display
    render() { return (
        <div>
            Nth Root Generator
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Start Value.. (enter a number)" ref="start" />
                <SubmitButton  value="Start" ref="submitButton"/>
            </form>
            {this.state.percentComplete > 0 ? <Progress percentComplete={this.state.percentComplete} /> : ''}
            {this.state.jobID.length ? <p>Job ID: {this.state.jobID}</p> : ''}


        </div>
    );}
}

//            <p>{this.state.results.elapsed_time ? 'Elapsed Time: ' + this.state.results.elapsed_time : ''}</p>

//<p>{this.state.results.values_array ? 'Values: ' + this.state.results.values_array : ''}</p>


//data: "{"values_array":["2582.01","2582.01","2582.011","2582.011","2582.011"],"elapsed_time":"0.378688"}"