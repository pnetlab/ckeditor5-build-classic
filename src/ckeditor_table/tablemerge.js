/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import MergeSelectCellCommand from './commands/mergeselectcellcommand';
import tableMergeCellIcon from '@ckeditor/ckeditor5-table/theme/icons/table-merge-cell.svg';

import { addListOption } from '@ckeditor/ckeditor5-table/src/tableui';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TableMerge extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'TableMerge';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		
		const editor = this.editor;
		const t = this.editor.t;
		
		editor.commands.add( 'mergeTableSelectCell', new MergeSelectCellCommand( editor) );
		
		editor.ui.componentFactory.add( 'mergeTableCells', locale => {
				const options = [
					{
						type: 'button',
						model: {
							commandName: 'mergeTableSelectCell',
							label: t( 'Merge cell' )
						}
					},
					{ type: 'separator' },
					{
						type: 'button',
						model: {
							commandName: 'splitTableCellVertically',
							label: t( 'Split cell vertically' )
						}
					},
					{
						type: 'button',
						model: {
							commandName: 'splitTableCellHorizontally',
							label: t( 'Split cell horizontally' )
						}
					}
				];
				return this._prepareDropdown( t( 'Merge cells' ), tableMergeCellIcon, options, locale );
			});

	}
	
	_prepareDropdown( label, icon, options, locale ) {
		const editor = this.editor;

		const dropdownView = createDropdown( locale );
		const commands = [];

		// Prepare dropdown list items for list dropdown.
		const itemDefinitions = new Collection();

		for ( const option of options ) {
			addListOption( option, editor, commands, itemDefinitions );
		}

		addListToDropdown( dropdownView, itemDefinitions );

		// Decorate dropdown's button.
		dropdownView.buttonView.set( {
			label,
			icon,
			tooltip: true
		} );

		// Make dropdown button disabled when all options are disabled.
		dropdownView.bind( 'isEnabled' ).toMany( commands, 'isEnabled', ( ...areEnabled ) => {
			return areEnabled.some( isEnabled => isEnabled );
		} );

		this.listenTo( dropdownView, 'execute', evt => {
			editor.execute( evt.source.commandName );
			editor.editing.view.focus();
		} );

		return dropdownView;
	}

	
	
}



