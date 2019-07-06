import React from 'react';
import { Document, Page } from "react-pdf/dist/entry.webpack";
import "react-pdf/dist/Page/AnnotationLayer.css";


class MyPDFViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numPages: null,
            scale: 1.0,
            width: 0
        };

        this.onDocumentLoadSuccess = ({ numPages }) => {
            this.setState({ numPages });
        }

        this.zoomIn = () => {
            this.setState(prevState => {
                return { scale: prevState.scale + 0.1 }
            })
        }
        this.zoomOut = () => {
            this.setState(prevState => {
                return { scale: prevState.scale - 0.1 }
            })
        }
        this.zoomOut = () => {
            this.setState(prevState => {
                return { scale: prevState.scale - 0.1 }
            })
        }
        this.updateWidth = () => {
            this.setState({
                width: this.refs.doc.parentNode.clientWidth
            });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWidth);
        this.updateWidth();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWidth);
    }

    render() {
        const { src } = this.props;
        const { numPages, scale, width } = this.state;
        var pages = Array.from(Array(numPages).keys());

        return (
            <div ref="doc">
                {/* <button onClick={this.zoomIn}>+</button>
                <button onClick={this.zoomOut}>-</button> */}
                <Document style={{ display: 'none' }} file={src} renderInteractiveForm={true} onLoadSuccess={this.onDocumentLoadSuccess}>
                    {pages.map(pageIndex => (
                        <Page scale={scale} key={pageIndex} pageNumber={pageIndex + 1} width={width} />
                    ))}
                </Document>

                {/* <object data={src} type="application/pdf">
                    <embed src={src} type="application/pdf" />
                </object> */}
            </div>
        )
    }
}

export default MyPDFViewer;