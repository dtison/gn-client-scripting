# Gravity Neutral Client Scripts

## Overview

Client-side browser scripts for  Gravity Neutral's 
Parallel Computing and Web Server Integration Platform

* Submitting Jobs
* Displaying Job Progress
* Displaying Job Results

## Getting the Sources

Cloned from github:

```bash
npm login blah blah
```

## Usage

In the header, include scripts:

```javascript
<script type="text/jsx;harmony=true" src="/js/gn-client.js"></script>
<script type="text/jsx;harmony=true" src="/js/cuda-piestimator.js"></script>
```

and setup React Component:

```javascript
<script type="text/jsx" >
    (function() {
        'use strict';
        React.render(
            <CUDAPiEstimatorJob />,
            document.getElementById('react-job')
        );
    })();
</script>
```
(There has to be an HTML element named react-job.)

