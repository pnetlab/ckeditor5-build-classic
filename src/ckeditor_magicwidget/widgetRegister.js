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
export default function widgetRegister(editor, modelName, options={}){
	
		_registerSchema(editor, modelName);
		_registerConverters(editor, modelName);
		
		
	}
	
	
	function _registerSchema(editor, modelName) {
		editor.model.schema.extend( modelName, {
			allowAttributes: ['margic_widget', 'position', 'width', 'height', 'wunit', 'hunit'],
			defaults: {position: 'relative'},
			isObject: true,
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	
	
	function _registerConverters(editor, modelName) {

		editor.conversion.for( 'downcast' ).attributeToAttribute( {
		    model: {
		        name: modelName,
		        key: 'position',
		    },
		    view: modelAttributeValue =>{
	    		return {
	    			key: 'style',
	    			value: {
	    				position: modelAttributeValue
	    			}
	    		}
		    }
		} );
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
			dispatcher.on( 'insert:'+modelName, ( evt, data, conversionApi ) => {
			var viewElement = conversionApi.mapper.toViewElement( data.item );
			conversionApi.writer.addClass('magic_widget', viewElement);
			})
		);
		
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
			dispatcher.on( 'attribute:width:'+modelName, ( evt, data, conversionApi ) => {
				_resizeDowncast(evt, data, conversionApi);
			} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher => 
		dispatcher.on( 'attribute:wunit:'+modelName, ( evt, data, conversionApi ) => {
			_resizeDowncast(evt, data, conversionApi);
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:height:'+modelName, ( evt, data, conversionApi ) => {
			_resizeDowncast(evt, data, conversionApi);
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:hunit:'+modelName, ( evt, data, conversionApi ) => {
			_resizeDowncast(evt, data, conversionApi);
			
		} )
		);

	}
	
	
	function _resizeDowncast(evt, data, conversionApi){
		var modelElement = data.item;
		var viewWriter = conversionApi.writer;
		var viewElement = conversionApi.mapper.toViewElement( data.item );
		
		var width = modelElement.getAttribute('width');
		var height = modelElement.getAttribute('height');
		var wunit = modelElement.getAttribute('wunit');
		var hunit = modelElement.getAttribute('hunit');
		
		if(isset(width) && width != '' && isset(wunit) && wunit != '' ){
			viewWriter.setStyle('width', modelElement.getAttribute('width') + modelElement.getAttribute('wunit'), viewElement)
		}else{
			viewWriter.removeStyle('width', viewElement)
		}
		
		if(isset(height) && height != '' && isset(hunit) && hunit != '' ){
			viewWriter.setStyle('height', modelElement.getAttribute('height') + modelElement.getAttribute('hunit'), viewElement)
		}else{
			viewWriter.removeStyle('height', viewElement)
		}
	}

	
	






