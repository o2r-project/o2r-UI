import React from 'react';

class FourteenC extends React.Component {
    render () {        
        return (
            <div style={{ textAlign: 'left', marginLeft: '5%', marginTop: '3%' }}>
                {this.props.content.split(/\n/).map((line,index) => (
                    <div key={index}>
                        {line}
                    </div>
                ))}
            </div>
        )
    }
}

export default FourteenC;