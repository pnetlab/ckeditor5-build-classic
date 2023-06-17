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
export default function MenuFactory(editor, modelName, options={}){
	
		_registerSchema(editor, modelName);
		_registerConverters(editor, modelName);
		
		
	}
	
	
	function _registerSchema(editor, modelName) {
		editor.model.schema.extend( modelName, {
			allowAttributes: [
			                  'menu_id'
			                ],
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	
	
	function _registerConverters(editor, modelName) {
		
		// editor.conversion.for( 'downcast' ).add( dispatcher =>
		// dispatcher.on( 'attribute:menu_id:'+modelName, ( evt, data, conversionApi ) => {
		// 	// console.log('rtest');
		// 	// const viewWriter = conversionApi.writer;
		// 	// const viewElement = conversionApi.mapper.toViewElement( data.item );
			
		// 	// if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
		// 	// 	viewWriter.setAttribute( 'menu_id', data.attributeNewValue, viewElement );
		// 	// } else {
		// 	// 	viewWriter.removeAttribute( 'menu_id', viewElement );
		// 	// }
		// 	const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			
			
		// } )
		// );

		

	}

	
	






