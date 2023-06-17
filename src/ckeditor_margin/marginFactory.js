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
export default function MarginFactory(editor, modelName, options={}){
	
		_registerSchema(editor, modelName);
		_registerConverters(editor, modelName);
		
		
	}
	
	
	function _registerSchema(editor, modelName) {
		editor.model.schema.extend( modelName, {
			allowAttributes: [
			                  'marginLeft', 
			                  'marginRight', 
			                  'marginTop', 
			                  'marginBottom', 
			                  'marginable'
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
		dispatcher.on( 'attribute:marginLeft:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'margin-left', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'margin-left', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:marginRight:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'margin-right', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'margin-right', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:marginTop:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'margin-top', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'margin-top', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:marginBottom:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'margin-bottom', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'margin-bottom', viewElement );
			}
		} )
		);

	}

	
	






