import React, { Component } from 'react';
class Footer extends Component {
    render() {
        return (
            <>
                <footer className="footer">
                    <div className="d-sm-flex justify-content-center justify-content-sm-between py-2">
                        <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Founder © <a href="https://www.facebook.com/giang.nara.hhnr/" target="_blank" rel="noopener noreferrer">TUPA </a>06/2022</span>
                        <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Co-Founder <a href="https://www.facebook.com/tuanh894" target="_blank" rel="noopener noreferrer"> ANHTT </a>  </span>
                    </div>
                </footer>
            </>
        );
    }
}

export default Footer;