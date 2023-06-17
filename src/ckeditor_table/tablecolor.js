/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import tableColorIcon from './ui/icons/delicious-brands.svg';

import SetCellColorCommand from './commands/setcellcolorcommand';
import ReactView from '../ui/reactview';
import React from 'react'
import ColorPicker from '../ui/components/ColorPicker';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TableColor extends Plugin {
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
		return 'TableColor';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
		this._registerConverters();
		
		editor.commands.add( 'setCellColor', new SetCellColorCommand( editor ) );
		
		
		editor.ui.componentFactory.add( 'colorTable', locale => {
			const command = editor.commands.get( 'setCellColor' );
			const dropdownView = createDropdown( locale );
			
			dropdownView.bind('isEnabled').to(command);

			// Decorate dropdown's button.
			dropdownView.buttonView.set( {
				icon: tableColorIcon,
				label: t('Cell Color'),
				tooltip: true
			} );
			
			var ui = new ReactView(locale, <ColorPicker ref={ui=>this.colorUI = ui} 
        	onChange={(values)=>{this._borderCtrl(values)}}>
        	</ColorPicker>);
        
	        dropdownView.buttonView.on('execute', ()=>{
	        	this.colorUI.setValue(this._getColor());
	        })
			
	        dropdownView.panelView.children.add(ui);
	        
	        return dropdownView;
		})
		

		
	}
	
	
	_registerSchema() {
		this.editor.model.schema.extend( 'tableCell', {
			allowAttributes: 'background'
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate table's attribute to the img tag.
		editor.conversion.for( 'downcast' ).add( dispatcher => 
		
			dispatcher.on( 'attribute:background:tableCell', ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const tableCellElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== '' ) {
				viewWriter.setStyle( 'background', data.attributeNewValue, tableCellElement );
			}else{
				viewWriter.removeStyle( 'background', tableCellElement );
			}
			
		}) 
		
		);
		


		editor.conversion.for( 'upcast' )
			.attributeToAttribute( {
				view: {
					name: 'td', 
					styles: {
						background:/.+/
					}
				},
				model: {
					key: 'background',
					value: viewElement => viewElement.getStyle( 'background' )
				}
			} );
		
		editor.conversion.for( 'upcast' )
			.attributeToAttribute( {
				view: {
					name: 'th', 
					styles: {
						background:/.+/
					}
				},
				model: {
					key: 'background',
					value: viewElement => viewElement.getStyle( 'background' )
				}
			} );
		
		
	}
	
	_borderCtrl(values){ 
		var values = {'background': values}
		this.editor.execute('setCellColor', {values})
	}
	
	_getColorable(){
		var selection = this.editor.model.document.selection.getSelectedElement();
		
		if(selection && selection.name == 'table'){
			var tableModel = selection;
		}else{
			selection = this.editor.model.document.selection.getFirstPosition();
			var tableModel = findParent( selection, (item)=>item.name=='table');
		}
		
		var selected = tableModel.getAttribute('selected');
		
		if(selected && Object.keys(selected).length > 0){
			return selected[Object.keys(selected)[0]];
		}else{
			return findFirstChild(tableModel, (child)=>child.name=='tableCell');
		}
			
	}
	
	
	_getColor(){
		var borderableElement = this._getColorable();
		
		if(borderableElement){
			return borderableElement.getAttribute('background');
		}else{
			return '';
		}
		
	}

	
	
}



