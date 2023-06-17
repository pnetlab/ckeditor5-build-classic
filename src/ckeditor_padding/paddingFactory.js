/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */



/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default function PaddingFactory(editor, modelName, options={}){
	
		_registerSchema(editor, modelName);
		_registerConverters(editor, modelName);
		
		
	}
	
	
	function _registerSchema(editor, modelName) {
		editor.model.schema.extend( modelName, {
			allowAttributes: [
			                  'paddingLeft', 
			                  'paddingRight', 
			                  'paddingTop', 
			                  'paddingBottom', 
			                  'paddingable'
			                  ],
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	
	
	function _registerConverters(editor, modelName) {

		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:paddingLeft:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'padding-left', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'padding-left', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:paddingRight:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'padding-right', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'padding-right', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:paddingTop:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'padding-top', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'padding-top', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:paddingBottom:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'padding-bottom', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'padding-bottom', viewElement );
			}
		} )
		);

	}

	
	






