import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ipcRenderer } from 'electron'

import Header from '../components/header'
import Button from '../components/ui/button'

function Home() {
  const [consoles, setConsoles] = React.useState([])

  React.useEffect(() => {
    ipcRenderer.send('stream', {
      type: 'get_consoles'
    })

    ipcRenderer.on('stream', (event, args) => {
      if(args.type === 'error'){
        alert((args.data !== undefined) ? args.message+': '+JSON.stringify(args.data) : args.message)
      } else {
        console.log('got event response:', args)
        setConsoles(args.data)
      }
    })

    return () => {
      ipcRenderer.removeAllListeners('stream');
  };
}, []);

  return (
    <React.Fragment>
      <Head>
        <title>Greenlight - My Consoles</title>
      </Head>

      <div>
        {consoles.map((item, i) => {     
           console.log("Entered");                 
           // Return the element. Also pass key     
           return (
            <div key={i}>
              <p>Name: {item.name}</p>
              <p>ID: {item.id}</p>
              <p>State: {item.powerState}</p>
              <p>Type: {item.consoleType}</p>
              <p>Assistant: {item.digitalAssistantRemoteControlEnabled ? 'Enabled' : 'Disabled'}</p>
              <p>Remote: {item.remoteManagementEnabled ? 'Enabled' : 'Disabled'}</p>
              <p>Streaming: {item.consoleStreamingEnabled ? 'Enabled' : 'Disabled'}</p>
              <Link href={ `stream/${item.id}` }>
                <Button label="Start stream" />
              </Link>
              <br /><br />
            </div>
           ) 
        })}
      </div>

    </React.Fragment>
  );
};

export default Home;