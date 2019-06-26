import React from 'react';
import 'react-reflex/styles.css';
import './erc.css';

import {
  ReflexContainer,
  ReflexElement,
  ReflexSplitter
} from 'react-reflex'

/////////////////////////////////////////////////////////
// Re-Flex Basic vertical layout non-resizable
//
/////////////////////////////////////////////////////////
class ERC
  extends React.Component {
    constructor() {
        super();
        this.state = { 
            
        };
      }
  render () {

    return (
        <div className="Erc">
        <ReflexContainer style={{ height: "87vh" }} orientation="vertical">
            <ReflexElement className="left-pane">
                <div className="pane-content">
                    <label>Left Pane (resizable)</label>
                </div>
            </ReflexElement>
            <ReflexSplitter propagate={true} style={{ width: "10px" }} />
            <ReflexElement className="right-pane">
                <ReflexContainer orientation="horizontal">
                    <ReflexElement className="right-up">
                        <div className="pane-content">
                            <label>Right Pane (resizable)</label>
                        </div>
                    </ReflexElement>
                    <ReflexSplitter propagate={true} style={{ height: "10px" }} />
                    <ReflexElement className="right-bottom">
                        <div className="pane-content">
                            <label>Bottom Pane</label>
                        </div>
                    </ReflexElement>
                </ReflexContainer>
            </ReflexElement>
        </ReflexContainer>
      </div>
    )
  }
}

export default ERC;