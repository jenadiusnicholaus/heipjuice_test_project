import React from 'react';
import { setCaretToEnd } from '../utilities/utils.js';
import ComponentEditableBlock from './component_editable_block.js';
import '../styles/editable_page_style.css'
import initialBlock from '../utilities/initialBlock.js'


class ComponentEditablePage extends React.Component {
   constructor(props) {
    super(props);
     this.state = {
      blocks: [initialBlock]
     };
  }

  updatePage = (updatedBlock)=> {
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html
    };
    this.setState({ blocks: updatedBlocks });
  }

  addBlock = (currentBlock) => {
    const newBlock = initialBlock
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    this.setState({ blocks: updatedBlocks }, () => {
      currentBlock.ref.nextElementSibling.focus();
    });
  }

  deleteBlock = (currentBlock)=> {
    const previousBlock = currentBlock.ref.previousElementSibling;
    if (previousBlock) {
      const blocks = this.state.blocks;
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      this.setState({ blocks: updatedBlocks }, () => {
        setCaretToEnd(previousBlock);
        previousBlock.focus();
      });
    }
  }

  render() {
    return (
      <div className="Page">
        {this.state.blocks.map((block, key) => {
          return (
            <ComponentEditableBlock
              key={key}
              id={block.id}
              tag={block.tag}
              html={block.html}
              updatePage={this.updatePage}
              addBlock={this.addBlock}
              deleteBlock={this.deleteBlock}
            />
          );
        })}
      </div>
    );
  }
}

export default ComponentEditablePage;

