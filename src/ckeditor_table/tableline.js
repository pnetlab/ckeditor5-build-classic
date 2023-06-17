/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import tableColorIcon from './ui/icons/border-all-solid.svg'

import SetLineCommand from './commands/setlinecommand';
import ReactView from '../ui/reactview';
import React from 'react'
import BorderComp from '../ckeditor_border/ui/BorderComp';
import makeBorder from '../ckeditor_border/borderFactory';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TableLine extends Plugin {
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
		return 'TableLine';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
//		this._registerConverters();
		
		editor.commands.add( 'SetLineCommand', new SetLineCommand( editor ) );
		
		editor.ui.componentFactory.add( 'lineTable', locale => {
			const command = editor.commands.get( 'SetLineCommand' );
			const dropdownView = createDropdown( locale );
			
			

			// Decorate dropdown's button.
			dropdownView.buttonView.set( {
				icon: tableColorIcon,
				label: t('Line'),
				tooltip: true
			} );
			
			var ui = new ReactView(locale, <BorderComp ref={ui=>this.borderUI = ui} 
        	onChange={(values)=>{this._borderCtrl(values)}}>
        	</BorderComp>);
        
	        dropdownView.buttonView.on('execute', ()=>{
	        	this.borderUI.setValue(this._getBorder());
	        })
			
	        dropdownView.panelView.children.add(ui);
	        
	        dropdownView.bind('isEnabled').to(command);
			
			return dropdownView;
		})
		

		
	}
	
	_registerSchema() {
		this.editor.model.schema.extend( 'tableCell', {
			allowAttributes: ['alignment'], 
			defaults: {
				borderLeft: 'solid',
				borderRight: 'solid',
				borderTop: 'solid',
				borderBottom: 'solid',
				borderColor: '#dedede',
				borderWeight: '1px',
			}
		});
		
		makeBorder(this.editor, 'table');
		makeBorder(this.editor, 'tableCell');
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */ 
//	_registerConverters() {
//		const editor = this.editor;
//
//		// Dedicated converter to propagate table's attribute to the img tag.
//		editor.conversion.for( 'downcast' ).add( dispatcher => {
//		
//				dispatcher.on( 'attribute:borderColor:tableCell', ( evt, data, conversionApi ) => {
//				
//					const viewWriter = conversionApi.writer;
//					const tableCellElement = conversionApi.mapper.toViewElement( data.item );
//					
//					if ( data.attributeNewValue !== '' ) {
//						viewWriter.setStyle( 'border-color', data.attributeNewValue, tableCellElement );
//					}else{
//						viewWriter.removeStyle( 'border-color', tableCellElement );
//					}
//				
//				}) 
//				
//				dispatcher.on( 'attribute:borderWidth:tableCell', ( evt, data, conversionApi ) => {
//					
//					const viewWriter = conversionApi.writer;
//					const tableCellElement = conversionApi.mapper.toViewElement( data.item );
//					
//					if ( data.attributeNewValue !== '' ) {
//						viewWriter.setStyle( 'border-width', data.attributeNewValue, tableCellElement );
//					}else{
//						viewWriter.removeStyle( 'border-width', tableCellElement );
//					}
//				
//				}) 
//			
//			}
//		
//		);
//		
//
//
//		editor.conversion.for( 'upcast' )
//			.attributeToAttribute( {
//				view: {
//					name: 'td', 
//					styles: {
//						'border-color':/.+/
//					}
//				},
//				model: {
//					key: 'borderColor',
//					value: viewElement => viewElement.getStyle( 'border-color' )
//				}
//			} );
//		
//		editor.conversion.for( 'upcast' )
//			.attributeToAttribute( {
//				view: {
//					name: 'th', 
//					styles: {
//						'border-color':/.+/
//					}
//				},
//				model: {
//					key: 'borderColor',
//					value: viewElement => viewElement.getStyle( 'border-color' )
//				}
//			} );
//		editor.conversion.for( 'upcast' )
//			.attributeToAttribute( {
//				view: {
//					name: 'td', 
//					styles: {
//						'border-width':/.+/
//					}
//				},
//				model: {
//					key: 'borderWidth',
//					value: viewElement => viewElement.getStyle( 'border-width' )
//				}
//			} );
//		
//		editor.conversion.for( 'upcast' )
//			.attributeToAttribute( {
//				view: {
//					name: 'th', 
//					styles: {
//						'border-width':/.+/
//					}
//				},
//				model: {
//					key: 'borderWidth',
//					value: viewElement => viewElement.getStyle( 'border-width' )
//				}
//			} );
//		
//	}
//	
	
	_borderCtrl(values){ 
		this.editor.execute('SetLineCommand', {values: values})
	}
	
	_getBorderable(){
		
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
	
	
	_getBorder(){
		var borderableElement = this._getBorderable();
		
		if(borderableElement){
			return {
				borderLeft: borderableElement.getAttribute('borderLeft'),
				borderRight: borderableElement.getAttribute('borderRight'),
				borderTop: borderableElement.getAttribute('borderTop'),
				borderBottom: borderableElement.getAttribute('borderBottom'),
				borderWeight: borderableElement.getAttribute('borderWeight'),
				borderColor: borderableElement.getAttribute('borderColor'),
				borderRadius: borderableElement.getAttribute('borderRadius'),
			}
		}else{
			return {};
		}
		
	}

	
	
}



