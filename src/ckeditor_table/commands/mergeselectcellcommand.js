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
export default class MergeSelectCellCommand extends Command {
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
	execute() {

		const editor = this.editor;
		var selection = this.editor.model.document.selection.getSelectedElement();
		
		if(selection && selection.name == 'table'){
			var tableModel = selection;
		}else{
			selection = this.editor.model.document.selection.getFirstPosition();
			var tableModel = findParent( selection, (item)=>item.name=='table');
		}

		if(!tableModel) return;
		

		editor.model.change( writer => {
			var selected = editor.selectCells;
			var selectSize = {};
			for (let i in selected){
				var cell = selected[i];
				var [row, col] = i.split('_');
				var rowspan = get(cell.getAttribute('rowspan'),1);
				var colspan = get(cell.getAttribute('colspan'),1);
				
				
				for(let j=0; j<rowspan; j++){
					var rowIndex = Number(row)+j;
					if(!selectSize[rowIndex]) selectSize[rowIndex] = [];
					selectSize[rowIndex].push(colspan);
				}
			}
			
			var maxWidth = 0;
			for (let i in selectSize){
				var width = selectSize[i].reduce((a, b) => a + b);
				if(maxWidth == 0) maxWidth = width;
				if(maxWidth != width) return;
			}
			var maxHeight = Object.keys(selectSize).length;
			
			var selectedKeys = Object.keys(selected);
			for( let i=1; i < selectedKeys.length; i++){
				writer.remove(selected[selectedKeys[i]]);
			}
			writer.setAttribute('colspan', maxWidth, selected[selectedKeys[0]]);
			writer.setAttribute('rowspan', maxHeight, selected[selectedKeys[0]]);
		} );
		
	}
	
	_checkEnable(){
		var selection = this.editor.model.document.selection.getSelectedElement();
		if(selection && selection.name == 'table') return true;
		selection = this.editor.model.document.selection.getFirstPosition();
		return findParent( selection, (item)=>item.name=='table') != null;
	}

}