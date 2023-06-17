/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import {findAncestor} from '@ckeditor/ckeditor5-table/src/commands/utils';
/**
 * The base font command.
 *
 * @extends module:core/command~Command
 */
export default class FontCommand extends Command {
	/**
	 * Creates an instance of the command.
	 *
	 * @param {module:core/editor/editor~Editor} editor Editor instance.
	 * @param {String} attributeKey The name of a model attribute on which this command operates.
	 */
	constructor( editor, attributeKey ) {
		super( editor );

		/**
		 * When set, it reflects the {@link #attributeKey} value of the selection.
		 *
		 * @observable
		 * @readonly
		 * @member {Boolean} module:font/fontcommand~FontCommand#value
		 */

		/**
		 * A model attribute on which this command operates.
		 *
		 * @readonly
		 * @member {Boolean} module:font/fontcommand~FontCommand#attributeKey
		 */
		this.attributeKey = attributeKey;
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		this.value = doc.selection.getAttribute( this.attributeKey );
		//this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, this.attributeKey );
		this.isEnabled = true;
	}

	/**
	 * Executes the command. Applies the `value` of the {@link #attributeKey} to the selection.
	 * If no `value` is passed, it removes the attribute from the selection.
	 *
	 * @protected
	 * @param {Object} [options] Options for the executed command.
	 * @param {String} [options.value] The value to apply.
	 * @fires execute
	 */
	execute( options = {} ) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;
		const value = options.value;
		
		if(this.editor.selectCells && Object.keys(this.editor.selectCells).length > 1){
			
			model.change( writer => {
				
				var selected = this.editor.selectCells
				for (let i in selected){
					var validChild = findChildren(selected[i], (item => model.schema.checkAttribute(item, this.attributeKey)) );
					for (let j in validChild ){
						if ( value ) {
							
							writer.setAttribute( this.attributeKey, value, validChild[j] );
						} else {
							writer.removeAttribute( this.attributeKey, validChild[j] );
						}
					}
					
				}
				
			} );
			
			
		}else{
			
			model.change( writer => {
				if ( selection.isCollapsed ) {
					if ( value ) {
						writer.setSelectionAttribute( this.attributeKey, value );
					} else {
						writer.removeSelectionAttribute( this.attributeKey );
					}
				} else {
					const ranges = model.schema.getValidRanges( selection.getRanges(), this.attributeKey );

					for ( const range of ranges ) {
						if ( value ) {
							writer.setAttribute( this.attributeKey, value, range );
						} else {
							writer.removeAttribute( this.attributeKey, range );
						}
					}
				}
			} );
		}

		
	}
	
}
