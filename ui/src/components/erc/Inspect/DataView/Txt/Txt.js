import React from 'react';

class Txt extends React.Component {
    render () {        
        return (
            <div style={{ textAlign: 'left', marginLeft: '5%', marginTop: '3%' }}>
                {this.props.txt.split(/\n/).map((line,index) => (
                    <div key={index}>
                        {line}
                    </div>
                ))}
            </div>
        )
    }
}

export default Txt;