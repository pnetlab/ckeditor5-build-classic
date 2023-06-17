/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WidgetResize from '@ckeditor/ckeditor5-widget/src/widgetresize';

import widgetFactory from '../ckeditor_magicwidget/widgetFactory';
import widgetRegister from '../ckeditor_magicwidget/widgetRegister';


/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TableResize extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ WidgetResize ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'TableResize';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		//const command = new TableResizeCommand( editor );

		this._registerSchema();
		this._registerConverters();

		//editor.commands.add( 'TableResize', command );

//		editor.editing.downcastDispatcher.on( 'insert:table', ( evt, data, conversionApi ) => {
//			const widget = conversionApi.mapper.toViewElement( data.item );
//			const resizer = editor.plugins
//				.get( WidgetResize )
//				.attachTo( {
//					unit: '%',
//					modelElement: data.item,
//					viewElement: widget,
//					downcastWriter: conversionApi.writer,
//					getHandleHost( domWidgetElement ) {
//						return domWidgetElement;
//					},
//					getResizeHost( domWidgetElement ) {
//						return domWidgetElement;
//					},
//					// TODO consider other positions.
//					onCommit( newValue ){
//						const tableElement = editor.model.document.selection.getSelectedElement();
//						editor.model.change( writer => {
//							writer.setAttribute( 'width', newValue, tableElement);
//						} );
//					}
//
//				} );
//
//		}, { priority: 'low' } );
	}

	
	_registerSchema() {
		// widgetRegister(this.editor, 'table');
		// this.editor.model.schema.extend( 'table', {
		// 	defaults: {width:'100', wunit:'%'}
		// });
	}

	
	_registerConverters() {
		 
		// this.editor.conversion.for( 'editingDowncast' ).add( dispatcher => 
		// 	dispatcher.on( 'insert:table', ( evt, data, conversionApi ) => {
		// 		this.editor.editing.view.change(writer=>{
		// 			var table = conversionApi.mapper.toViewElement( data.item );
		// 			var widgetFac = new widgetFactory(this.editor);
		// 			widgetFac.make(writer, data.item, table, {resize: 'horizontal', onSelect:()=>{
		// 				this.editor.model.change(writer=>{
		// 					writer.setAttributes({selected:{}, select_event:''}, data.item);
		// 				})
		// 			}});
		// 		})
				
		// 	})
		
		// ) 
		
	}
}

