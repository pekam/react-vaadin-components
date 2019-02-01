import ReactDOM from 'react-dom';

export default superClass => class Overlaid extends superClass {

  _createOverlayContentContainer() {
    return document.createElement('div');
  }

  _configRef(element) {
    element.renderer = root => {
      if (!this.state.portals.length) {
        this._overlayContentContainer = this._createOverlayContentContainer();
        const portal = ReactDOM.createPortal(this.props.children, this._overlayContentContainer);
        this.setState({portals: [portal]});
      }
      this._rendererRoot = root;
      this._rendererRoot.appendChild(this._overlayContentContainer);
    };

    if (this._rendererRoot && this._overlayContentContainer) {
      this._rendererRoot.appendChild(this._overlayContentContainer);
    }
  }

}