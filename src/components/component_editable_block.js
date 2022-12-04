// eslint-disable-next-line

import React from 'react';
import ContentEditable from "react-contenteditable";
import '../styles/editable_block_style.css'
import { determinCaretPossion, setCaretToEnd } from '../utilities/utils.js'
import ComponentSelectableMenu from './component_selectable_menu'


class ComponentEditableBlock extends React.Component {
  constructor(props) {
      super(props);
    this.contentEditable = React.createRef();
    this.state = {
      htmlBackup: null,
      html: "",
      // Set the p tag as initial block tag
      tag: "p",
      previousKey: "",
      selectMenuIsOpen: false,
      selectMenuPosition: {
        x: null,
        y: null
      }
    };
  }

componentDidMount = () => {
    this.setState({ html: this.props.html, tag: this.props.tag });
  }
onContentEdibleChange = (e) => {
    this.setState({ html: e.target.value });
    console.log(e.target.value)
  }

componentDidUpdate = (prevProps, prevState) => {
    const htmlChanged = prevState.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    if (htmlChanged || tagChanged) {
      this.props.updatePage({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag
      });
    }
  }

onKeyDownHandler = (e) => {
    if (e.key === "/") {
      this.setState({ htmlBackup: this.state.html });
    }
  
    //adds a new block
    if (e.key === "Enter") {
        e.preventDefault();
        this.props.addBlock({
          id: this.props.id,
          ref: this.contentEditable.current
        });
    }
  
  // romeve a blank Block
    if (e.key === "Backspace" && !this.state.html) {
      e.preventDefault();
      this.props.deleteBlock({
        id: this.props.id,
        ref: this.contentEditable.current
      });
    }
    this.setState({ previousKey: e.key });
}
  
//=============== select menu =============
onKeyUpHandler = (e)=> {
    if (e.key === "/") {
      this.openBlocType();
    }
  }

openBlocType = () => {
    const { x, y } = determinCaretPossion();
    this.setState({
      selectMenuIsOpen: true,
      selectMenuPosition: { x, y }
    });
    document.addEventListener("click", this.closeBlockTypeSheet);
  }

  closeBlockTypeSheet =() =>{
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null }
    });
    document.removeEventListener("click", this.closeBlockTypeSheet);
  }

blockTagSelectionHandler =(tag)=> {
    this.setState({ tag: tag, html: this.state.htmlBackup }, () => {
      setCaretToEnd(this.contentEditable.current);
      this.closeBlockTypeSheet();
    });
  }

render() {
      return (
        <>
        {this.state.selectMenuIsOpen && (
            <ComponentSelectableMenu
            className ='SelectableMenu'
            position={this.state.selectMenuPosition}
            onSelect={this.blockTagSelectionHandler}
            close={this.closeBlockTypeSheet}
          />
              )}
              <ContentEditable
            className="Block"
            innerRef={this.contentEditable}
            html={this.state.html}
            tagName={this.state.tag}
            onChange={this. onContentEdibleChange}
            onKeyDown={this.onKeyDownHandler}
            onKeyUp={this.onKeyUpHandler}
        />
        </>
        
    );
  }
}

export default ComponentEditableBlock;