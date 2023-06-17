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
			allowAttributes: ['classname',
			                  'id',
			                  'display',
			                  'position',
			                  'overflow',
			                  'cursor',
			                  'float',
			                  'flexWrap',
			                  'flexDirection',
			                  'flexGrow',
			                  'alignSelf',
			                  'alignItems',
			                  'justifyContent',
			                  'top',
			                  'right',
			                  'left',
			                  'bottom', 
							  'positionable',
							  'alignment'
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
		dispatcher.on( 'insert:'+modelName, ( evt, data, conversionApi ) => {
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			viewWriter.setAttribute('positionable', true, viewElement);
		} )
		);

		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:classname:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.addClass(data.attributeNewValue, viewElement );
				viewWriter.setAttribute('classname', data.attributeNewValue, viewElement);
			} 
			viewWriter.removeClass(data.attributeOldValue, viewElement);
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:id:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setAttribute( 'id', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeAttribute( 'id', viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'editingDowncast' ).add( dispatcher =>
		dispatcher.on( 'attribute:display:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );

			var oldValue = data.attributeOldValue;
			if (oldValue) oldValue = oldValue.replace(/d(\-[\w]{2})?\-none/g, '');
			viewWriter.removeClass(oldValue, viewElement);

			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				var newValue = data.attributeNewValue.replace(/d(\-[\w]{2})?\-none/g, '');
				viewWriter.setAttribute('display', newValue, viewElement);
				viewWriter.addClass(newValue, viewElement );
			} 
			
		} )
		);

		editor.conversion.for( 'dataDowncast' ).add( dispatcher =>
			dispatcher.on( 'attribute:display:'+modelName, ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
	
				viewWriter.removeClass(data.attributeOldValue, viewElement);
	
				if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
					viewWriter.setAttribute('display', data.attributeNewValue, viewElement);
					viewWriter.addClass(data.attributeNewValue, viewElement );
				} 
				
			} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:position:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'position', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'position', viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:overflow:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'overflow', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'overflow', viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:cursor:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'cursor', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'cursor', viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:float:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'float', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'float', viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:flexWrap:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( {
					'flex-wrap': data.attributeNewValue,
					'-ms-flex-wrap': data.attributeNewValue,
			    
				}, viewElement );
				
			} else {
				viewWriter.removeStyle( ['flex-wrap', '-ms-flex-wrap'], viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:flexDirection:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( {
					'flex-direction': data.attributeNewValue,
					'-ms-flex-direction': data.attributeNewValue,
			    
				}, viewElement );
				
			} else {
				viewWriter.removeStyle( ['flex-direction', '-ms-flex-direction'], viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:flexGrow:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( {
					'-webkit-box-flex': data.attributeNewValue,
					'-ms-flex-positive': data.attributeNewValue,
					'flex-grow': data.attributeNewValue,
			    
				}, viewElement );
			
			} else {
				viewWriter.removeStyle( ['-webkit-box-flex', '-ms-flex-positive', 'flex-grow'], viewElement );
			}
		})
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:alignSelf:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( {
					'-ms-flex-item-align': data.attributeNewValue,
					'-ms-grid-row-align': data.attributeNewValue,
					'align-self': data.attributeNewValue,
			    
				}, viewElement );
			
			} else {
				viewWriter.removeStyle( ['-ms-flex-item-align', '-ms-grid-row-align', 'align-self'], viewElement );
			}
			
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:alignItems:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( {
					'-webkit-box-align': data.attributeNewValue,
					'-ms-flex-align': data.attributeNewValue,
					'align-items': data.attributeNewValue,
			    
				}, viewElement );
			
			} else {
				viewWriter.removeStyle( ['-webkit-box-align', '-ms-flex-align', 'align-items'], viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:justifyContent:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( {
					'-webkit-box-pack': 'justify',
					'-ms-flex-pack': 'justify',
					'justify-content': data.attributeNewValue,
			    
				}, viewElement );
			
			} else {
				viewWriter.removeStyle( ['-webkit-box-pack', '-ms-flex-pack', 'justify-content'], viewElement );
			}
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:top:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'top', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'top', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:right:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'right', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'right', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:left:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'left', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'left', viewElement );
			}
		} )
		);
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:bottom:'+modelName, ( evt, data, conversionApi ) => {
			
			const viewWriter = conversionApi.writer;
			const viewElement = conversionApi.mapper.toViewElement( data.item );
			
			if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
				viewWriter.setStyle( 'bottom', data.attributeNewValue, viewElement );
			} else {
				viewWriter.removeStyle( 'bottom', viewElement );
			}
		} )
		);

		editor.conversion.for( 'downcast' ).add( dispatcher =>
			dispatcher.on( 'attribute:alignment:'+modelName, ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				
				if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
					viewWriter.setStyle( 'alignment', data.attributeNewValue, viewElement );
				} else {
					viewWriter.removeStyle( 'alignment', viewElement );
				}
			} )
		);
	

	}

	
	






