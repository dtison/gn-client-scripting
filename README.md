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
git clone https://github.com/dtison/gn-client-scripting.git
```

## Usage

In your page header, include scripts:

Load React 
(***for development you can use the JSX Transformer - 
for production you will need to pre-compile using webpack)

```javascript
    <script src="http://fb.me/react-0.13.2.js"></script>
    <script src="http://fb.me/JSXTransformer-0.13.2.js"></script>
```

Load Gravity Neutral components

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

## License
Copyright (c) 2015 Gravityneutral.com David Ison. Licensed under the MIT license.
               