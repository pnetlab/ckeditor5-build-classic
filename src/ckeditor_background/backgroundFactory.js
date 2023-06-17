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
export default function BackgroundFactory(editor, modelName, options={}){
	
		_registerSchema(editor, modelName);
		_registerConverters(editor, modelName);
		
		
	}
	
	
	function _registerSchema(editor, modelName) {
		editor.model.schema.extend( modelName, {
			allowAttributes: [
			                  'backgroundImage', 
			                  'backgroundColor', 
			                  'backgroundable',
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
		dispatcher.on( 'attribute:backgroundImage:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='' ) {
				viewWriter.setStyle( {
					'background-image': `url("${data.attributeNewValue}")`,
					'background-size': 'cover',
					'background-position': 'center',
					 
				}, viewElement );
			} else {
				viewWriter.removeStyle( 'background-image', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:backgroundColor:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'background-color', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'background-color', viewElement );
			}
		} )
		);
		

	}

	
	






