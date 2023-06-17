/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/commands/mergecellcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The merge cell command.
 *
 * The command is registered by {@link module:table/tableediting~TableEditing} as `'mergeTableCellRight'`, `'mergeTableCellLeft'`,
 * `'mergeTableCellUp'` and `'mergeTableCellDown'` editor commands.
 *
 * To merge a table cell at the current selection with another cell, execute the command corresponding with the preferred direction.
 *
 * For example, to merge with a cell to the right:
 *
 *		editor.execute( 'mergeTableCellRight' );
 *
 * **Note**: If a table cell has a different [`rowspan`](https://www.w3.org/TR/html50/tabular-data.html#attr-tdth-rowspan)
 * (for `'mergeTableCellRight'` and `'mergeTableCellLeft'`) or [`colspan`](https://www.w3.org/TR/html50/tabular-data.html#attr-tdth-colspan)
 * (for `'mergeTableCellUp'` and `'mergeTableCellDown'`), the command will be disabled.
 *
 * @extends module:core/command~Command
 */
export default class SetLineCommand extends Command {
	/**
	 * Creates a new `MergeCellCommand` instance.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor on which this command will be used.
	 * @param {Object} options
	 * @param {String} options.direction Indicates which cell to merge with the currently selected one.
	 * Possible values are: `'left'`, `'right'`, `'up'` and `'down'`.
	 */
	constructor( editor, options ) {
		super( editor );

		
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		this.isEnabled = this._checkEnable();
	}

	/**
	 * Executes the command.
	 *
	 * Depending on the command's {@link #direction} value, it will merge the cell that is to the `'left'`, `'right'`, `'up'` or `'down'`.
	 *
	 * @fires execute
	 */
	execute(option={}) {
		var selection = this.editor.model.document.selection.getSelectedElement();
		
		if(selection && selection.name == 'table'){
			var tableModel = selection;
		}else{
			selection = this.editor.model.document.selection.getFirstPosition();
			var tableModel = findParent( selection, (item)=>item.name=='table');
		}
		
		var selected = this.editor.selectCells
		if(!selected) return;
		
		this.editor.model.change(writer=>{
			
			if(Object.keys(selected).length > 0){
				for( let i in selected){
					writer.setAttributes(option.values, selected[i]);
				}
			}else{
				for(let row of tableModel.getChildren()){
					for(let cell of row.getChildren()){
						writer.setAttributes(option.values, cell);
					}
				}
			}
		
		})	
		
		
		
		
		
	}
	
	_checkEnable(){
		
		var selection = this.editor.model.document.selection.getSelectedElement();
		if(selection && selection.name == 'table') return true;
		selection = this.editor.model.document.selection.getFirstPosition();
		return findParent( selection, (item)=>item.name=='table') != null;
	}

}