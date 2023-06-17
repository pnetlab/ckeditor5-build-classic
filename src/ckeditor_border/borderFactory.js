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
export default function BorderFactory(editor, modelName, options={}){
	
		_registerSchema(editor, modelName);
		_registerConverters(editor, modelName);
		
		
	}
	
	
	function _registerSchema(editor, modelName) {
		editor.model.schema.extend( modelName, {
			allowAttributes: [
			                  'borderLeft', 
			                  'borderRight', 
			                  'borderTop', 
			                  'borderBottom', 
			                  'borderWeight',
			                  'borderColor',
			                  'borderRadius',
			                  'borderable',
							  ]
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	
	
	function _registerConverters(editor, modelName) {
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:borderColor:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'border-color', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'border-color', viewElement );
			}
		} )
		);

		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:borderLeft:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'border-left-style', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'border-left-style', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:borderRight:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'border-right-style', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'border-right-style', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:borderTop:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'border-top-style', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'border-top-style', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:borderBottom:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'border-bottom-style', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'border-bottom-style', viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:borderWeight:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'border-width', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'border-width', viewElement );
			}
		} )
		);
		
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:borderRadius:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'border-radius', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'border-radius', viewElement );
			}
		} )
		);

	}

	
	






